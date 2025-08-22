import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { FaLock, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true); 
    setError('');
    
    try {
      const response = await authService.login(formData.username, formData.password);
      
      // Stocker le token
      localStorage.setItem('token', response.token);
      
      // Créer un utilisateur simple (on va le corriger après)
      const user = {
        username: formData.username,
        roles: ['ROLE_ADMIN'] // Temporairement admin pour tous
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Connexion réussie !');
      navigate('/customers');
      
    } catch (err) { 
      const errorMessage = err.response?.data || 'Identifiants invalides';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="login-hero">
      <Card className="surface login-card p-3">
        <div className="text-center pb-1">
          <h2 className="login-title mb-1">Bienvenue 👋</h2>
          <div className="login-subtitle">Connectez-vous pour continuer</div>
        </div>
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted"><FaUser /></span>
              <Form.Control 
                className="pill-input" 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Entrer votre identifiant" 
                required 
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Mot de passe</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted"><FaLock /></span>
              <Form.Control 
                className="pill-input" 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••" 
                required 
              />
            </div>
          </Form.Group>
          <Button 
            type="submit" 
            className="w-100 gradient-btn" 
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <span className="text-muted me-1">Pas encore de compte ?</span>
          <Link to="/register" className="text-decoration-none fw-bold">Créer un compte</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
