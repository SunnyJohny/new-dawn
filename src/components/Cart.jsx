import React, { useState } from 'react';
import { useMyContext } from '../Context/MyContext';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CartItem = ({ id, name, price, quantity = 1 }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useMyContext();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-sm font-medium">{name}</h3>
        </div>
        <span className="text-sm text-gray-600">₦{price}</span>
        <FaMinus
          className="cursor-pointer text-sm text-gray-500 hover:text-red-500"
          onClick={() => decreaseQuantity(id)}
        />
        <p className="text-sm mx-2">{quantity}</p>
        <FaPlus
          className="cursor-pointer text-sm text-gray-500 hover:text-green-500"
          onClick={() => increaseQuantity(id)}
        />
        <p className="ml-4 text-sm">₦{price * quantity}</p>
        <FaTrash
          className="ml-4 cursor-pointer text-pink-500 hover:text-red-600"
          onClick={() => removeFromCart(id)}
        />
      </div>
    </div>
  );
};

const OverallTotal = ({ total, onClearItems, whatsappOrderText }) => (
  <div className="flex flex-col items-end mt-4">
    <p className="text-lg font-bold mb-2">Total: ₦{total.toLocaleString()}</p>

    <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
      <a
        href={`https://wa.me/2348038652949?text=${encodeURIComponent(whatsappOrderText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Order
      </a>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        onClick={onClearItems}
      >
        Clear
      </button>
    </div>
  </div>
);

const Cart = () => {
  const { cart, clearCart, toggleCart, capitalizeWords } = useMyContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const overallTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const numberToWords = (num) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertWholeNumber = (num) => {
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10];
      if (num < 1000) return a[Math.floor(num / 100)] + " Hundred " + convertWholeNumber(num % 100);
      if (num < 1000000) return convertWholeNumber(Math.floor(num / 1000)) + " Thousand " + convertWholeNumber(num % 1000);
      return "Amount too large";
    };

    const [wholePart, koboPart] = num.toString().split('.');
    const wholePartWords = convertWholeNumber(Number(wholePart));
    let koboWords = '';
    if (koboPart) {
      koboWords = `and ${convertWholeNumber(Number(koboPart))} Kobo`;
    }
    return `${wholePartWords} Naira ${koboWords}`.trim();
  };

  // 🟢 Generate WhatsApp Order Text
  const whatsappOrderText = `
🍽️ *Order Request*

${cart.map(item =>
  `*${capitalizeWords(item.name)}* - ₦${(item.price * item.quantity).toLocaleString()} (${item.quantity}x)`
).join('\n')}

*Total:* ₦${overallTotal.toLocaleString()}
*In Words:* ${numberToWords(overallTotal)}
  `;

  return (
    <div className="fixed right-0 top-0 w-full sm:w-[400px] h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 sticky top-0 bg-white z-10">
        <h2 className="text-xl font-bold text-gray-800">Cart</h2>
        <button
          onClick={toggleCart}
          className="text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      {/* Table Headers */}
      <div className="grid grid-cols-4 gap-2 sm:flex sm:justify-between mb-2 text-sm sm:text-base px-4 pt-4">
        <span className="font-bold text-center sm:text-left">Name</span>
        <span className="font-bold text-center sm:text-left">Amount (₦)</span>
        <span className="font-bold text-center sm:text-left">Qty</span>
        <span className="font-bold text-center sm:text-left">Total (₦)</span>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-4 px-4">
        {cart.map((item) => (
          <CartItem key={item.id} {...item} />
        ))}
      </div>

      {/* Total */}
      <div className="px-4 pb-8">
        <OverallTotal
          total={overallTotal}
          onClearItems={clearCart}
          whatsappOrderText={whatsappOrderText}
        />
      </div>
    </div>
  );
};

export default Cart;
