import { customAlphabet } from "nanoid";
import { Stripe } from "stripe";

const stripe = new Stripe("sk_test_51NRdJ9FeGs7sQPrqJKUsLVyX9ULxIj2iAmrOrLEdDqvUB89jlIAE1gJuIiV1VTKI5QcV51Fy5h5kRRNlu5dKGF4g00caE41fDp");

const plans = ["price_1NtAS2FeGs7sQPrqOqDOA3ua", " price_1O9mr4FeGs7sQPrqazSZ3kEi", "price_1O9muZFeGs7sQPrq4oGlEb0u"];
let totalCoupons = 500;

export async function createCoupons() {
  let coupons1 = [];
  let coupons2 = [];
  let coupons3 = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  {
    const generateUniqueId = customAlphabet(alphabet, 3);
    let id = 1;
    for (const planId of plans) {
      if(id === 1){
        totalCoupons = 520;
      }else{
        totalCoupons = 500;

      }
      for (let i = 1; i <=  totalCoupons; i++) {
        const uniqueCouponID = `SZ-T${id}-${generateUniqueId()}p1${generateUniqueId()}`;
        try {
          if(id === 1){
            coupons1.push(uniqueCouponID);
          }else if(id === 2){
            coupons2.push(uniqueCouponID);
          }else{
            coupons3.push(uniqueCouponID);

          }
          console.log('okk')
          const coupon = await stripe.coupons.create({
            name: uniqueCouponID,
            percent_off: 100,
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
    console.log(coupons1)
    console.log(coupons2)
    console.log(coupons3)
  }
}

