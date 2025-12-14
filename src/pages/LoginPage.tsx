import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, error } = await login(email, password);
      if (success) {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo à área administrativa.',
        });
        navigate('/admin');
      } else {
        toast({
          title: 'Erro no login',
          description: error || 'Verifique suas credenciais.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <div>
        <PageHeader title="Área do Usuário" />
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Você está conectado</CardTitle>
              <CardDescription>
                Acesse o painel administrativo ou faça logout.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/admin')} className="w-full">
                Acessar Painel Admin
              </Button>
              <Button variant="outline" onClick={logout} className="w-full">
                Sair
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 pt-0">
      <PageHeader title="Login" subtitle="Acesso administrativo" />

      <div className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              Entrar no Sistema
            </CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar a área administrativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
