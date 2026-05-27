import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Safaricom Daraja STK callback. No signature is provided; we rely on the
// checkout_request_id being a server-issued opaque id to validate the row.
export const Route = createFileRoute("/api/public/mpesa-callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: any;
        try { payload = await request.json(); }
        catch { return new Response("Bad JSON", { status: 400 }); }

        const stk = payload?.Body?.stkCallback;
        if (!stk?.CheckoutRequestID) {
          return Response.json({ ResultCode: 0, ResultDesc: "ignored" });
        }
        const checkoutId: string = stk.CheckoutRequestID;
        const resultCode: number = stk.ResultCode;
        const resultDesc: string = stk.ResultDesc;

        // Items array on success
        const items: Array<{ Name: string; Value: any }> = stk.CallbackMetadata?.Item ?? [];
        const item = (n: string) => items.find((i) => i.Name === n)?.Value;
        const receipt = item("MpesaReceiptNumber") as string | undefined;

        const status = resultCode === 0 ? "success" : (resultCode === 1032 ? "canceled" : "failed");

        await supabaseAdmin.from("mpesa_transactions").update({
          status, result_code: resultCode, result_desc: resultDesc,
          mpesa_receipt: receipt ?? null, raw_payload: payload,
        }).eq("checkout_request_id", checkoutId);

        // Update order + decrement stock + notify admin
        const { data: txn } = await supabaseAdmin
          .from("mpesa_transactions").select("order_id, amount").eq("checkout_request_id", checkoutId).single();

        if (txn?.order_id) {
          const orderStatus = status === "success" ? "paid" : (status === "canceled" ? "canceled" : "failed");
          await supabaseAdmin.from("orders").update({
            status: orderStatus, mpesa_receipt: receipt ?? null,
          }).eq("id", txn.order_id);

          if (status === "success") {
            const { data: order } = await supabaseAdmin
              .from("orders").select("product_id, quantity, product_name, total, user_id")
              .eq("id", txn.order_id).single();
            if (order?.product_id) {
              // decrement stock
              const { data: prod } = await supabaseAdmin
                .from("products").select("stock").eq("id", order.product_id).single();
              if (prod) {
                await supabaseAdmin.from("products")
                  .update({ stock: Math.max(0, prod.stock - order.quantity) })
                  .eq("id", order.product_id);
              }
            }
            // notify buyer
            if (order?.user_id) {
              await supabaseAdmin.from("notifications").insert({
                user_id: order.user_id,
                title: "Payment received",
                body: `KES ${order.total} for ${order.product_name} confirmed (${receipt}).`,
                type: "success",
              });
            }
            // notify admins (broadcast row)
            await supabaseAdmin.from("notifications").insert({
              user_id: null,
              title: "New paid order",
              body: `${order?.product_name} — KES ${order?.total} (${receipt})`,
              type: "order",
            });
          }
        }

        return Response.json({ ResultCode: 0, ResultDesc: "ok" });
      },
    },
  },
});
