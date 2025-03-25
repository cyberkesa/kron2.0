import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LOGIN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(emailAddress: $email, password: $password) {
      ... on LogInSuccessResult {
        accessToken
        refreshToken
      }
      ... on LogInErrorDueToAccountNotFound {
        message
      }
      ... on LogInErrorDueToWrongPassword {
        message
      }
    }
  }
`;

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const [logIn, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const onSubmit: SubmitHandler<LoginFormInputs> = (formData) => {
    logIn({ variables: { email: formData.email, password: formData.password } });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Вход</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input 
            type="email"
            {...register('email', { required: 'Email обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Пароль</label>
          <input 
            type="password"
            {...register('password', { required: 'Пароль обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Ошибка: {error.message}</p>}
        {data && data.logIn && data.logIn.accessToken && (
          <p className="text-green-500 text-sm mt-2">Вход выполнен успешно!</p>
        )}
      </form>
    </div>
  );
};

export default Login;
