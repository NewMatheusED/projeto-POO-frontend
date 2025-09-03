import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Input } from '~/components/ui';
import styles from './profile.module.css';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    bio: 'Desenvolvedor Full Stack com foco em React e Node.js'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de atualização do perfil
    console.log('Perfil atualizado:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        <p className={styles.subtitle}>
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              <span className={styles.avatarText}>JS</span>
            </div>
            <Button variant="outline" size="sm">
              Alterar Foto
            </Button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome Completo</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>E-mail</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Telefone</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Biografia</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
              />
            </div>

            <div className={styles.actions}>
              <Button type="submit" variant="primary" size="lg">
                Salvar Alterações
              </Button>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className={styles.footer}>
        <Link to="/dashboard" className={styles.backLink}>
          ← Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
