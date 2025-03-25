import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm, SubmitHandler } from 'react-hook-form';

type ViewerData = {
  viewer: {
    id: string;
    name: string;
    emailAddress: string;
    phoneNumber?: string;
    region: {
      id: string;
      name: string;
    };
  } | null;
};

const GET_VIEWER = gql`
  query GetViewer {
    viewer {
      ... on RegisteredViewer {
        id
        name
        emailAddress
        phoneNumber
        region {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_NAME_MUTATION = gql`
  mutation UpdateName($name: String!) {
    updateName(name: $name) {
      ... on UpdateNameSuccessResult {
        nothing
      }
      ... on UnexpectedError {
        message
      }
    }
  }
`;

type UpdateNameInputs = {
  name: string;
};

const UserProfile: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateNameInputs>();
  const { data, loading, error, refetch } = useQuery<ViewerData>(GET_VIEWER);
  const [updateName, { data: updateData, loading: updateLoading, error: updateError }] = useMutation(UPDATE_NAME_MUTATION);

  const onSubmit: SubmitHandler<UpdateNameInputs> = (formData) => {
    updateName({ variables: { name: formData.name } }).then(() => refetch());
  };

  if (loading) return <p className="text-center py-10">Загрузка профиля...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Ошибка загрузки профиля: {error.message}</p>;

  const user = data?.viewer;
  if (!user) {
    return <p className="text-center py-10">Пользователь не найден. Войдите в систему.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
      <div className="mb-6">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Имя:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.emailAddress}</p>
        {user.phoneNumber && <p><strong>Телефон:</strong> {user.phoneNumber}</p>}
        <p><strong>Регион:</strong> {user.region.name}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Обновить имя</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Новое имя</label>
          <input 
            type="text"
            {...register('name', { required: 'Имя обязательно' })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={updateLoading}
        >
          {updateLoading ? 'Обновление...' : 'Обновить имя'}
        </button>
        {updateError && <p className="text-red-500 text-sm mt-2">Ошибка: {updateError.message}</p>}
        {updateData && !updateData.updateName.message && (
          <p className="text-green-500 text-sm mt-2">Имя успешно обновлено!</p>
        )}
        {updateData && updateData.updateName.message && (
          <p className="text-red-500 text-sm mt-2">{updateData.updateName.message}</p>
        )}
      </form>
    </div>
  );
};

export default UserProfile;
