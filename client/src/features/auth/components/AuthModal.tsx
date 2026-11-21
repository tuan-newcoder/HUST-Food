import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={true}
    >
      <div className="-m-6">
        {mode === 'login' && (
          <LoginPage
            onSuccess={onClose}
            onNavigateToRegister={() => setMode('register')}
            onNavigateToForgotPassword={() => setMode('forgot')}
          />
        )}
        {mode === 'register' && (
          <RegisterPage
            onSuccess={onClose}
            onNavigateToLogin={() => setMode('login')}
          />
        )}
        {mode === 'forgot' && (
          <ForgotPasswordPage
            onSuccess={() => setMode('login')}
            onNavigateToLogin={() => setMode('login')}
          />
        )}
      </div>
    </Modal>
  );
};

