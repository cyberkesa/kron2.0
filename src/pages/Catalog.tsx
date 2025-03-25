import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_CATEGORIES = gql`
  query GetCategories {
    rootCategories {
      ... on RootBranchCategory {
        id
        title
        slug
        iconUrl
      }
      ... on RootLeafCategory {
        id
        title
        slug
        iconUrl
      }
    }
  }
`;

const Catalog: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">
        Загрузка категорий...
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-center py-10 text-red-500">
        Ошибка загрузки категорий: {error.message}
      </p>
    );
  }

  const categories = data?.rootCategories;

  if (!categories || categories.length === 0) {
    return (
      <p className="text-center py-10 text-gray-600">
        Категории не найдены.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Каталог категорий</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category: any) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="flex flex-col items-center bg-white shadow rounded p-4 hover:shadow-lg transition"
          >
            {category.iconUrl ? (
              <img
                src={category.iconUrl}
                alt={category.title}
                className="w-20 h-20 object-cover mb-4"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center mb-4 bg-gray-200 rounded">
                <span className="text-gray-600 text-xl">
                  {category.title.charAt(0)}
                </span>
              </div>
            )}
            <h2 className="text-xl font-semibold text-center">
              {category.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
