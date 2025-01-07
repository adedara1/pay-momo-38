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
        threshold: 0.1,
        root: null,
        rootMargin: "0px"
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
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "start"
      });
    }
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