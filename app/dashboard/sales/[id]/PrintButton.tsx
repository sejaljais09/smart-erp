"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => {
        console.log("Print clicked");
        window.print();
      }}
      className="bg-blue-600 text-white px-4 py-2 mt-6 rounded print:hidden"
    >
      Print Invoice
    </button>
  );
}