import stripe from "stripe";
import { customAlphabet } from "nanoid";
stripe = new stripe("key");

const plans = ["plan_id_1", "plan_id_2", "plan_id_3"];
const totalCoupons = 500;

async function createCoupons() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  {
    const generateUniqueId = customAlphabet(alphabet, 3);
    let id = 1;
    for (const planId of plans) {
      for (let i = 1; i <= totalCoupons; i++) {
        const uniqueCouponID = `SZ-T${id}-${generateUniqueId()}prompt-${generateUniqueId()}`;
        try {
          const coupon = await stripe.coupons.create({
            name: uniqueCouponID,
            percent_off: 10,
            duration: "once",
            currency: "usd",
            max_redemptions: 1,
            metadata: {
              plan: planId,
            },
          });
          console.log(`Created coupon: ${uniqueCouponID}`);
        } catch (error) {
          console.error(`Error creating coupon: ${uniqueCouponID}`, error);
        }
      }
      id++;
    }
  }
}

createCoupons();
