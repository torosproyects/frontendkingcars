'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  User,
  Bell,
  Palette,
  Shield,
  MessageCircle,
  Globe,
  Moon,
  Sun,
  Mail,
  Lock,
  CreditCard,
  Languages,
  Smartphone,
  Monitor,
  Save,
  X
} from 'lucide-react';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
};

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    sms: true
  });
  const [language, setLanguage] = useState('es');
  const [theme, setTheme] = useState('system');

  // Detectar preferencia del sistema
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    
    setTheme(savedTheme);
    
    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(savedDarkMode);
      if (savedDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem('theme', value);
    
    if (value === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (value === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const handleNotificationChange = (type: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Configuración</h1>
          <p className="text-muted-foreground">Gestiona tus preferencias y configuraciones de cuenta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation Menu - Mobile First */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-start gap-2 bg-accent text-accent-foreground">
                    <User className="h-4 w-4" />
                    Información Personal
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    Seguridad
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Bell className="h-4 w-4" />
                    Notificaciones
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Palette className="h-4 w-4" />
                    Apariencia
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-card border-border animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Tu apellido" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico
                    </div>
                  </Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="bg-card border-border animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      {darkMode ? <Moon className="h-5 w-5 text-secondary-foreground" /> : <Sun className="h-5 w-5 text-secondary-foreground" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Modo Oscuro</h3>
                      <p className="text-sm text-muted-foreground">Cambiar entre modo claro y oscuro</p>
                    </div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>

                <Separator className="bg-border" />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Tema del Sistema
                  </Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">Predeterminado del Sistema</SelectItem>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Idioma
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en">Inglés</SelectItem>
                      <SelectItem value="pt">Portugués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-card border-border animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Correo Electrónico</h3>
                      <p className="text-sm text-muted-foreground">Recibir notificaciones por email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Notificaciones Push</h3>
                      <p className="text-sm text-muted-foreground">Alertas en tiempo real</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={() => handleNotificationChange('push')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Mensajes SMS</h3>
                      <p className="text-sm text-muted-foreground">Notificaciones por mensaje de texto</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={() => handleNotificationChange('sms')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="bg-card border-border animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Cambiar Contraseña
                    </div>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Métodos de Pago
                    </div>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Autenticación de Dos Factores
                    </div>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}