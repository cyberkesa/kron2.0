import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';

type ResetPasswordFormInputs = {
  email: string;
  newPassword: string;
  passwordResetCode: string;
  passwordResetRequestId: string;
};

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $email: String!, 
    $newPassword: String!, 
    $passwordResetCode: String!, 
    $passwordResetRequestId: String!
  ) {
    resetPassword(
      emailAddress: $email, 
      newPassword: $newPassword, 
      passwordResetCode: $passwordResetCode, 
      passwordResetRequestId: $passwordResetRequestId
    ) {
      ... on ResetPasswordSuccessResult {
        nothing
      }
      ... on ResetPasswordErrorDueToPasswordResetCodeAlreadyUsed {
        message
      }
      ... on ResetPasswordErrorDueToPasswordResetCodeExpired {
        message
      }
      ... on ResetPasswordErrorDueToPasswordResetCodeMaximumEnterAttemptsExceeded {
        message
      }
      ... on ResetPasswordErrorDueToWrongPasswordResetCode {
        message
      }
    }
  }
`;

const ResetPassword: React.FC = () => {
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormInputs>();
  const [resetPassword, { data, loading, error }] = useMutation(RESET_PASSWORD_MUTATION);

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = (formData) => {
    resetPassword({
      variables: {
        email: formData.email,
        newPassword: formData.newPassword,
        passwordResetCode: formData.passwordResetCode,
        passwordResetRequestId: formData.passwordResetRequestId,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Сброс пароля</h1>
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
          <label className="block mb-1">Новый пароль</label>
          <input 
            type="password"
            {...formRegister('newPassword', { required: 'Новый пароль обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Код сброса</label>
          <input 
            type="text"
            {...formRegister('passwordResetCode', { required: 'Код сброса обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.passwordResetCode && <p className="text-red-500 text-sm">{errors.passwordResetCode.message}</p>}
        </div>
        <div>
          <label className="block mb-1">ID запроса сброса</label>
          <input 
            type="text"
            {...formRegister('passwordResetRequestId', { required: 'ID запроса обязателен' })}
            className="w-full p-2 border rounded"
          />
          {errors.passwordResetRequestId && <p className="text-red-500 text-sm">{errors.passwordResetRequestId.message}</p>}
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Сброс...' : 'Сбросить пароль'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">Ошибка: {error.message}</p>}
        {data && data.resetPassword && !data.resetPassword.message && (
          <p className="text-green-500 text-sm mt-2">Пароль успешно сброшен!</p>
        )}
        {data && data.resetPassword && data.resetPassword.message && (
          <p className="text-red-500 text-sm mt-2">{data.resetPassword.message}</p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
