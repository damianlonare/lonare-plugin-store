"use client";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import LicenseCard from "@/components/LicenseCard";
import { saveLicenses, type StoredLicense } from "@/lib/licenseStore";

export default function Delivered({ licenses }: { licenses: StoredLicense[] }) {
  const { clear, ready } = useCart();
  useEffect(() => {
    saveLicenses(licenses);
    if (ready) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
  return (
    <div className="mt-8 space-y-4">
      {licenses.map((l) => <LicenseCard key={l.key} l={l} />)}
    </div>
  );
}
