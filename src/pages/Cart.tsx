import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const GET_CART = gql`
  query GetCart {
    cart {
      id
      itemNodes {
        id
        quantity
        product {
          id
          name
          decimalPrice
          mainImage {
            url
          }
        }
      }
    }
  }
`;

const Cart: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CART);

  if (loading) {
    return <p className="text-center text-gray-600 py-10">Загрузка корзины...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 py-10">Ошибка загрузки корзины: {error.message}</p>;
  }

  const cart = data?.cart;
  if (!cart || cart.itemNodes.length === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingCartIcon className="w-16 h-16 mx-auto text-gray-400" />
        <p className="mt-4 text-lg">В корзине пока ничего нет</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Корзина</h1>
      {cart.itemNodes.map((item: any) => (
        <div key={item.id} className="flex items-center p-4 border-b">
          {item.product.mainImage && (
            <img
              src={item.product.mainImage.url}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{item.product.name}</h2>
            <p className="text-gray-600">Количество: {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{item.product.decimalPrice} ₽</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
