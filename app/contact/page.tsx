'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  Shield,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>


      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 relative">
          {/* Hero Background */}
          <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Customer service background"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos y te responderemos lo más pronto posible.
          </p>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="bg-green-50 border-green-200 max-w-2xl mx-auto">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Mensaje enviado exitosamente! Te contactaremos pronto.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Phone support background"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teléfono</h3>
                    <p className="text-gray-600">Llámanos directamente</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">+57 300 123 4567</p>
                  <p className="text-sm text-gray-600">Lun - Vie: 8:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Sáb: 9:00 AM - 2:00 PM</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
                <img
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Email support background"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">Escríbenos un correo</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">info@carking.com</p>
                  <p className="text-sm text-gray-600">Respuesta en 24 horas</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Office location background"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Oficina</h3>
                    <p className="text-gray-600">Visítanos</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Calle 100 #15-20</p>
                  <p className="text-sm text-gray-600">Bogotá, Colombia</p>
                  <p className="text-sm text-gray-600">Edificio Torre Central, Piso 8</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <img
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="24/7 support background"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Headphones className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Soporte 24/7</h3>
                    <p className="text-gray-600">Siempre disponibles</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Nuestro equipo de soporte está disponible las 24 horas para ayudarte con cualquier consulta sobre subastas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Contact form background"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 relative z-10">
                  <Send className="h-6 w-6 text-blue-600" />
                  Envíanos un mensaje
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nombre completo *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:bg-white/80 transition-colors duration-200"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo electrónico *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:bg-white/80 transition-colors duration-200"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:bg-white/80 transition-colors duration-200"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                        Asunto *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="mt-1 bg-white/70 border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:bg-white/80 transition-colors duration-200"
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Mensaje *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="mt-1 bg-white/70 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:bg-white/80 transition-colors duration-200"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                    />
                  </div>

                  <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-lg p-4 border border-blue-200/50">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Tu privacidad es importante</p>
                        <p>Toda la información que compartas será tratada de forma confidencial y solo será usada para responder a tu consulta.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando mensaje...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Enviar mensaje
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <img
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="FAQ background"
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-center text-2xl relative z-10">Preguntas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Cómo funciona la subasta?</h4>
                  <p className="text-sm text-gray-600">Las subastas duran entre 1-7 días. Los usuarios pujan y el mejor postor al final gana el carro.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Es seguro comprar aquí?</h4>
                  <p className="text-sm text-gray-600">Sí, verificamos todos los documentos y el historial de cada vehículo antes de la subasta.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Puedo cancelar una puja?</h4>
                  <p className="text-sm text-gray-600">Las pujas son vinculantes. Solo en casos excepcionales se pueden cancelar.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">¿Qué comisión cobran?</h4>
                  <p className="text-sm text-gray-600">Cobramos una comisión del 5% sobre el precio final de venta.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}