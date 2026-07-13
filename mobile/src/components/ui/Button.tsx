import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: "primary" | "outline";
}

export default function Button({
  title,
  loading,
  variant = "primary",
  className,
  ...rest
}: ButtonProps) {
  const baseStyle = "rounded-lg p-4 items-center";
  const variantStyle =
    variant === "primary" ? "bg-brand" : "border border-brand bg-white";
  const textStyle = variant === "primary" ? "text-white" : "text-brand";

  return (
    <TouchableOpacity
      className={`${baseStyle} ${variantStyle} ${className ?? ""}`}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#1a4d3e"} />
      ) : (
        <Text className={`font-semibold text-base ${textStyle}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
