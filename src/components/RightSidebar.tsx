import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RightSidebarProps = {
  isOpen?: boolean;
  onToggle?: () => void;
}

// Returning null instead of the actual sidebar
export function RightSidebar({ isOpen = false, onToggle }: RightSidebarProps) {
  return null;
}
