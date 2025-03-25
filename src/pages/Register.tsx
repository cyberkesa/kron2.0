import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

type RegisterFormInputs = {
  email: string;
  verificationCode: string;
  verificationRequestId: string;
  name: string;
  password: string;
  regionId: string;
};

const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!, 
    $verificationCode: String!, 
    $verificationRequestId: String!, 
    $name: String!, 
    $password: String!, 
    $regionId: ID!
  ) {
    register(
      emailAddress: $email, 
      emailAddressVerificationCode: $verificationCode, 
      emailAddressVerificationRequestId: $verificationRequestId, 
      name: $name, 
      password: $password, 
      regionId: $regionId
    ) {
      ... on RegisterSuccessResult {
        nothing
      }
      ... on RegisterErrorDueToEmailAddressAlreadyTaken {
        message
      }
      ... on RegisterErrorDueToEmailAddressVerificationCodeExpired {
        message
      }
      ... on RegisterErrorDueToEmailAddressVerificationCodeMaximumEnterAttemptsExceeded {
        message
      }
      ... on RegisterErrorDueToWrongEmailAddressVerificationCode {
        message
      }
    }
  }
`;

const Register: React.FC = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const [registerUser, { data, loading, error }] = useMutation(REGISTER_MUTATION);

  const onSubmit: SubmitHandler<RegisterFormInputs> = (formData) => {
    registerUser({ 
      variables: { 
        email: formData.email, 
        verificationCode: formData.verificationCode, 
        verificationRequestId: formData.verificationRequestId, 
        name: formData.name, 
        password: formData.password, 
        regionId: formData.regionId 
      } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input 
            type="email"
            {...formRegister('email', { required: 'Email обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Код верификации</label>
          <input 
            type="text"
            {...formRegister('verificationCode', { required: 'Код обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.verificationCode && <p className="text-red-500 text-sm">{errors.verificationCode.message}</p>}
        </div>
        <div>
          <label className="block mb-1">ID запроса верификации</label>
          <input 
            type="text"
            {...formRegister('verificationRequestId', { required: 'ID запроса обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.verificationRequestId && <p className="text-red-500 text-sm">{errors.verificationRequestId.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Имя</label>
          <input 
            type="text"
            {...formRegister('name', { required: 'Имя обязательно' })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Пароль</label>
          <input 
            type="password"
            {...formRegister('password', { required: 'Пароль обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block mb-1">ID региона</label>
          <input 
            type="text"
            {...formRegister('regionId', { required: 'ID региона обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.regionId && <p className="text-red-500 text-sm">{errors.regionId.message}</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Ошибка: {error.message}</p>}
        {data && data.register && !data.register.message && (
          <p className="text-green-500 text-sm mt-2">Регистрация успешна!</p>
        )}
        {data && data.register && data.register.message && (
          <p className="text-red-500 text-sm mt-2">{data.register.message}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
