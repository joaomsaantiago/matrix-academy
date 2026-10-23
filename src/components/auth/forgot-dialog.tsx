"use client";

import { useEffect, useRef } from "react";
import { ForgotPasswordForm } from "./password-forms";

/**
 * "Esqueci minha senha" como janela (modal) por cima da tela de entrar. Usa o <dialog> nativo:
 * o foco fica preso na janela, Esc fecha, e clicar fora também. `onClose` avisa quem abriu.
 */
export function ForgotDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="auth-dialog"
      aria-labelledby="forgot-title"
      onClose={onClose}
      onClick={(e) => {
        // clique no fundo escuro (fora do conteúdo) fecha
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="auth-dialog__inner">
        <button type="button" className="auth-dialog__close" onClick={onClose} aria-label="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <h2 id="forgot-title" className="auth-dialog__title">
          Recuperar senha
        </h2>
        <p className="auth-dialog__intro">
          Informe seu e-mail e enviaremos um link para criar uma nova senha.
        </p>
        <ForgotPasswordForm />
      </div>
    </dialog>
  );
}

