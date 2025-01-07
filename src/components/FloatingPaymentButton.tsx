import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FloatingPaymentButtonProps {
  formRef: React.RefObject<HTMLFormElement>;
}

const FloatingPaymentButton = ({ formRef }: FloatingPaymentButtonProps) => {
  const [isFormVisible, setIsFormVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Form is considered visible when 10% is in view
      }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, [formRef]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isFormVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
      <Button onClick={scrollToForm} className="w-full">
        Payer
      </Button>
    </div>
  );
};

export default FloatingPaymentButton;