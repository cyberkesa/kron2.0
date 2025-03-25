import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

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
  const navigate = useNavigate();
  const { logIn } = useAuth();

  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      const result = data.logIn;
      if ('accessToken' in result && result.accessToken) {
        logIn(result.accessToken, result.refreshToken);
        navigate('/profile');
      }
    }
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (formData) => {
    loginMutation({ variables: { email: formData.email, password: formData.password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Вход</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email обязателен' })}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Пароль</label>
            <input
              type="password"
              {...register('password', { required: 'Пароль обязателен' })}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
          {error && <p className="text-red-500 text-center">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
