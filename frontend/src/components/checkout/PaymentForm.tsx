import {
  PaymentElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

interface PaymentFormProps {
  orderId: string;
  onSuccess?: () => void;
}

const CheckoutPayment = ({ onSuccess }: Pick<PaymentFormProps, "onSuccess">) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setMessage("");

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`
      },
      redirect: "if_required"
    });

    if (result.error) {
      setMessage(result.error.message || "Payment failed");
    } else if (result.paymentIntent?.status === "succeeded") {
      setMessage("Payment successful");
      onSuccess?.();
    } else {
      setMessage("Payment is processing");
    }
    setSubmitting(false);
  };

  return (
    <Stack spacing={2}>
      <PaymentElement />
      {message && (
        <Alert severity={message === "Payment successful" ? "success" : "info"}>
          {message}
        </Alert>
      )}
      <Button
        variant="contained"
        disabled={!stripe || !elements || submitting}
        onClick={submit}
      >
        {submitting ? <CircularProgress size={22} /> : "Pay securely"}
      </Button>
    </Stack>
  );
};

const PaymentForm = ({ orderId, onSuccess }: PaymentFormProps) => {
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY as string | undefined;
  const stripePromise = useMemo(
    () => (publicKey ? loadStripe(publicKey) : null),
    [publicKey]
  );
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId || !publicKey) return;
    api
      .post("/payments/create-intent", { orderId })
      .then((response) => {
        setClientSecret(response.data.data.clientSecret);
      })
      .catch((requestError) => {
        setError(
          requestError.response?.data?.message ||
            "Unable to initialize payment"
        );
      });
  }, [orderId, publicKey]);

  if (!publicKey) {
    return <Alert severity="warning">Stripe public key is not configured.</Alert>;
  }
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!clientSecret || !stripePromise) return <CircularProgress />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutPayment onSuccess={onSuccess} />
    </Elements>
  );
};

export default PaymentForm;
