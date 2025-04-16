import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield, Brain, Heart, Sparkles, MessageCircle, Star, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 py-32"
      >
        <div className="text-center mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold mb-6"
          >
            Your Emotional AI <span className="text-[var(--loki-green-bright)]">Companion</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Experience the future of emotional support with our advanced AI companion, 
            powered by cutting-edge technology and genuine understanding
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/login')}
            className="loki-button text-xl px-12 py-4"
          >
            Start Your Journey
          </motion.button>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {[
            {
              icon: <Bot className="w-12 h-12 text-[var(--loki-green-bright)]" />,
              title: "24/7 AI Companion",
              description: "Always available to listen and support you through any situation"
            },
            {
              icon: <Brain className="w-12 h-12 text-[var(--loki-green-bright)]" />,
              title: "Advanced Intelligence",
              description: "Powered by state-of-the-art language models and emotional recognition"
            },
            {
              icon: <Shield className="w-12 h-12 text-[var(--loki-green-bright)]" />,
              title: "Secure & Private",
              description: "End-to-end encryption ensures your conversations remain confidential"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.2 }}
              className="feature-card"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* How It Works Section */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-10 h-10 text-[var(--loki-green-bright)]" />,
                title: "Create Account",
                description: "Sign up in seconds with your email or social accounts"
              },
              {
                icon: <MessageCircle className="w-10 h-10 text-[var(--loki-green-bright)]" />,
                title: "Start Chatting",
                description: "Begin your conversation with our emotionally intelligent AI"
              },
              {
                icon: <Heart className="w-10 h-10 text-[var(--loki-green-bright)]" />,
                title: "Share & Connect",
                description: "Open up about your thoughts, feelings, and experiences"
              },
              {
                icon: <Sparkles className="w-10 h-10 text-[var(--loki-green-bright)]" />,
                title: "Grow Together",
                description: "Receive personalized insights and emotional support"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-center mb-16">What Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This AI companion has been incredibly helpful in managing my daily stress and anxiety.",
                author: "Sarah J.",
                rating: 5
              },
              {
                quote: "I'm amazed by how understanding and insightful the conversations are. It feels very natural.",
                author: "Michael R.",
                rating: 5
              },
              {
                quote: "Having a 24/7 emotional support system has made a significant difference in my life.",
                author: "Emma L.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2 }}
                className="testimonial-card"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[var(--loki-green-bright)]" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <p className="text-[var(--loki-green-bright)]">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Emotional Well-being?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of users who have found support and understanding with our AI companion</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="loki-button text-xl px-12 py-4"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;