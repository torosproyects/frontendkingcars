'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  Gavel,
  Car,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { icon: Car, label: 'Carros Subastados', value: '2,500+', color: 'text-blue-600' },
    { icon: Users, label: 'Usuarios Activos', value: '15,000+', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Transacciones', value: '$50M+', color: 'text-purple-600' },
    { icon: Star, label: 'Calificación', value: '4.9/5', color: 'text-yellow-600' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Confianza',
      description: 'Verificamos cada vehículo y documento para garantizar transacciones seguras.',
      color: 'bg-blue-100 text-blue-600',
      bgImage: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Heart,
      title: 'Transparencia',
      description: 'Proceso claro y abierto. Sin costos ocultos ni sorpresas desagradables.',
      color: 'bg-red-100 text-red-600',
      bgImage: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: TrendingUp,
      title: 'Innovación',
      description: 'Tecnología de punta para ofrecer la mejor experiencia de subasta online.',
      color: 'bg-green-100 text-green-600',
      bgImage: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Construimos una comunidad de compradores y vendedores apasionados por los carros.',
      color: 'bg-purple-100 text-purple-600',
      bgImage: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const team = [
    {
      name: 'Carlos Rodríguez',
      role: 'CEO & Fundador',
      description: 'Experto en automotive con 15 años de experiencia en el sector.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'María González',
      role: 'CTO',
      description: 'Ingeniera de software especializada en plataformas de comercio electrónico.',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      name: 'Juan Pérez',
      role: 'Director de Operaciones',
      description: 'Especialista en logística y operaciones de subastas vehiculares.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  const milestones = [
    { year: '2020', title: 'Fundación', description: 'Nace CarKINg con la visión de revolucionar las subastas de carros' },
    { year: '2021', title: 'Primera Subasta', description: 'Realizamos nuestra primera subasta exitosa con 50 participantes' },
    { year: '2022', title: 'Expansión', description: 'Llegamos a 5 ciudades principales y 1,000 usuarios registrados' },
    { year: '2023', title: 'Crecimiento', description: 'Superamos las 10,000 transacciones y $20M en ventas' },
    { year: '2024', title: 'Liderazgo', description: 'Nos convertimos en la plataforma #1 de subastas de carros en Colombia' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      
      <div className="container mx-auto px-4 py-8 space-y-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto relative">
          {/* Hero Background Image */}
          <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
            <img
              src="https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Luxury cars background"
              className="w-full h-full object-cover opacity-10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
            <h2 className="relative text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Revolucionando las
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                subastas de carros
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Somos la plataforma líder en subastas de vehículos en Colombia, conectando compradores y vendedores 
            a través de una experiencia digital segura, transparente e innovadora.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          {/* Stats Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl -z-10" />
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                  <stat.icon className={`relative h-8 w-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <img
                src="https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Mission background"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                <Target className="h-6 w-6 text-blue-600" />
                Nuestra Misión
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-gray-700 leading-relaxed">
                Democratizar el acceso a vehículos de calidad a través de un sistema de subastas justo, 
                transparente y tecnológicamente avanzado, donde cada persona pueda encontrar el carro 
                de sus sueños al mejor precio posible.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
              <img
                src="https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Vision background"
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl relative z-10">
                <Eye className="h-6 w-6 text-purple-600" />
                Nuestra Visión
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-gray-700 leading-relaxed">
                Ser la plataforma de subastas de vehículos más confiable y reconocida de Latinoamérica, 
                transformando la manera en que las personas compran y venden carros, creando valor 
                para toda nuestra comunidad.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h3>
            <p className="text-lg text-gray-600">Los principios que guían cada decisión que tomamos</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-300">
                  <img
                    src={value.bgImage}
                    alt={`${value.title} background`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className={`w-16 h-16 rounded-full ${value.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h3>
            <p className="text-lg text-gray-600">El camino que nos ha llevado hasta aquí</p>
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-indigo-50/30 rounded-3xl -z-10" />
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-600 transform md:-translate-x-0.5 rounded-full shadow-lg"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transform -translate-x-3 md:-translate-x-3 z-10 shadow-lg border-4 border-white"></div>
                    
                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <Card className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300">
                              {milestone.year}
                            </Badge>
                            <h4 className="font-semibold text-lg text-gray-900">{milestone.title}</h4>
                          </div>
                          <p className="text-gray-600">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h3>
            <p className="text-lg text-gray-600">Las personas que hacen posible Carking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
                    <img
                      src={member.image}
                      alt={member.name}
                      className="relative w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.pexels.com/photos/3802508/pexels-photo-3802508.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Cars background"
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-8 md:p-12">
            <div className="text-center space-y-6 relative z-10">
              <h3 className="text-3xl font-bold">¿Por qué elegir CarKING?</h3>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Combinamos años de experiencia en el sector automotriz con tecnología de vanguardia 
                para ofrecerte la mejor experiencia de compra y venta de vehículos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 hover:scale-110 transform">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">100% Seguro</h4>
                  <p className="text-blue-100 text-sm">Verificación completa de documentos y vehículos</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 hover:scale-110 transform">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Proceso Rápido</h4>
                  <p className="text-blue-100 text-sm">Desde la subasta hasta la entrega en tiempo récord</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors duration-300 hover:scale-110 transform">
                    <Award className="h-8 w-8" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Mejor Precio</h4>
                  <p className="text-blue-100 text-sm">Precios justos determinados por el mercado</p>
                </div>
              </div>

              <div className="pt-6">
                <Link href="/auctions">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg">
                    <Gavel className="mr-2 h-5 w-5" />
                    Explorar Subastas
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}