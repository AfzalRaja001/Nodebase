import { authClient } from "./auth-client";

authClient.checkout({ slug: "pro" });
authClient.checkout({ priceId: "pro" });
authClient.checkout({ productId: "pro" });
