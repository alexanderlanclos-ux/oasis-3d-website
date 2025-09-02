/* 
 * OASIS MEDIA GROUP - 3D INTERACTIVE SHOWCASE
 * 
 * 🚀 GOHIGHLEVEL SETUP INSTRUCTIONS:
 * 
 * 1. In your GHL account, go to Settings > Webhooks
 * 2. Create a new webhook for "Contact Form"
 * 3. Copy the webhook URL and replace GHL_WEBHOOK_URL below
 * 4. Create another webhook for "Newsletter Signup" 
 * 5. Copy that URL and replace GHL_NEWSLETTER_WEBHOOK below
 * 
 * 📊 WEBHOOK PAYLOAD STRUCTURE:
 * Contact Form sends: firstName, lastName, email, budget, message, source, tags, customFields
 * Newsletter sends: email, source, tags, customFields
 * 
 * 🏷️ AUTOMATIC TAGS APPLIED:
 * Contact Form: ['website-lead', '3d-contact-form']
 * Newsletter: ['newsletter-signup', 'website-visitor']
 * 
 * 📈 ANALYTICS EVENTS TRACKED:
 * - contact_form_submit (success)
 * - contact_form_error (error)
 * - newsletter_signup (success)
 * - hotspot_hover, hotspot_open (user engagement)
 */

import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Brand tokens extracted from logo
const theme = {
  colors: {
    primary: '#FF6B35',
    coral: '#FF8E53', 
    golden: '#FFB547',
    teal: '#4ECDC4',
    cream: '#F7F3E9',
    charcoal: '#2C2C2C',
    night: '#1A1A1A',
    white: '#FFFFFF'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

// Hotspot data structure
const hotspotsData = [
  {
    id: 'about',
    position: [2, 1, 0],
    title: 'About',
    icon: '🏝️',
    content: {
      title: 'Our Story',
      subtitle: 'Where creativity meets the digital frontier',
      body: `Oasis Media Group blends strategy, design, and code to create playful, high-performing web experiences. Like an oasis in the digital desert, we provide refreshing solutions that stand out in the crowded online landscape.

Our team of creative technologists believes in the power of imagination paired with precision execution. We don't just build websites – we craft digital experiences that move people.`,
      cta: 'Discover Our Process'
    }
  },
  {
    id: 'services',
    position: [-2, 0.5, 1],
    title: 'Services',
    icon: '🚀',
    content: {
      title: 'What We Create',
      subtitle: 'Full-spectrum digital experiences',
      services: [
        {
          name: 'Interactive Sites',
          description: '3D web experiences that captivate and convert',
          icon: '✨'
        },
        {
          name: 'Brand Systems',
          description: 'Visual identities that tell your unique story',
          icon: '🎨'
        },
        {
          name: 'Content & Video',
          description: 'Engaging multimedia that drives engagement',
          icon: '🎬'
        },
        {
          name: 'E-commerce UX',
          description: 'Shopping experiences that feel effortless',
          icon: '🛍️'
        }
      ],
      cta: 'View Our Work'
    }
  },
  {
    id: 'work',
    position: [0, 0.8, 2],
    title: 'Projects',
    icon: '💎',
    content: {
      title: 'Featured Work',
      subtitle: 'Digital experiences that make an impact',
      projects: [
        {
          name: 'TechCorp 3D Site',
          category: 'Interactive',
          description: 'Award-winning WebGL experience',
          image: '🌟'
        },
        {
          name: 'Artisan Marketplace',
          category: 'E-commerce',
          description: 'Handcrafted shopping experience',
          image: '🛒'
        },
        {
          name: 'GreenTech Rebrand',
          category: 'Branding',
          description: 'Sustainable visual identity',
          image: '🌱'
        }
      ],
      cta: 'See All Projects'
    }
  },
  {
    id: 'testimonials',
    position: [-1, 0.3, -1.5],
    title: 'Testimonials',
    icon: '💬',
    content: {
      title: 'Client Love',
      subtitle: 'What our partners say about working with us',
      testimonials: [
        {
          quote: "Oasis transformed our digital presence completely. The 3D website they created gets compliments daily.",
          author: "Sarah Chen",
          company: "TechCorp"
        },
        {
          quote: "Working with Oasis felt like having a creative partner, not just a vendor. They truly understood our vision.",
          author: "Marcus Rodriguez", 
          company: "Artisan Co."
        }
      ],
      cta: 'Start Your Project'
    }
  }
];

// 3D Hotspot Component
function Hotspot({ position, title, icon, isActive, onClick, onHover }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const handleClick = () => {
    // Track hotspot click
    if (typeof gtag !== 'undefined') {
      gtag('event', 'hotspot_click', {
        event_category: 'User Engagement',
        event_label: title,
        value: 1
      });
    }
    onClick();
  };

  const handleHover = () => {
    setHovered(true);
    onHover(title);
    
    // Track hotspot hover
    if (typeof gtag !== 'undefined') {
      gtag('event', 'hotspot_hover', {
        event_category: 'User Engagement',
        event_label: title
      });
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            handleHover();
          }}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color={isActive ? theme.colors.golden : theme.colors.primary}
            emissive={isActive ? theme.colors.coral : theme.colors.primary}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color={theme.colors.white}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap"
        >
          {title}
        </Text>
        
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
        >
          {icon}
        </Text>

        {hovered && (
          <mesh position={[0, -0.1, 0]}>
            <ringGeometry args={[0.4, 0.5, 32]} />
            <meshBasicMaterial color={theme.colors.teal} transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// 3D Island/Platform
function Island() {
  return (
    <group>
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.5, 16]} />
        <meshStandardMaterial color={theme.colors.cream} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.2, 16]} />
        <meshStandardMaterial color={theme.colors.teal} roughness={0.6} />
      </mesh>

      {/* Decorative elements */}
      <Float speed={1} rotationIntensity={0.2}>
        <mesh position={[1.5, 0.2, 1.5]}>
          <coneGeometry args={[0.1, 0.5, 8]} />
          <meshStandardMaterial color={theme.colors.charcoal} />
        </mesh>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3}>
        <mesh position={[-1.8, 0.1, -1.2]}>
          <dodecahedronGeometry args={[0.2]} />
          <meshStandardMaterial color={theme.colors.coral} />
        </mesh>
      </Float>
    </group>
  );
}

// 3D Scene Component
function Scene({ activeHotspot, setActiveHotspot, setHoveredHotspot }) {
  const { camera } = useThree();
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={60} />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color={theme.colors.golden} />
      
      <Environment preset="night" />
      <Stars radius={300} depth={60} count={1000} factor={7} />
      
      <Island />
      
      {hotspotsData.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          position={hotspot.position}
          title={hotspot.title}
          icon={hotspot.icon}
          isActive={activeHotspot === hotspot.id}
          onClick={() => setActiveHotspot(hotspot.id)}
          onHover={setHoveredHotspot}
        />
      ))}
    </>
  );
}

// Right Side Panel Component
function SidePanel({ activeHotspot, onClose }) {
  const hotspot = hotspotsData.find(h => h.id === activeHotspot);
  
  if (!hotspot) return null;

  return (
    <div className="side-panel">
      <div className="panel-header">
        <h2>{hotspot.content.title}</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="panel-content">
        <p className="subtitle">{hotspot.content.subtitle}</p>
        
        {hotspot.content.body && (
          <div className="body-text">
            {hotspot.content.body.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
        
        {hotspot.content.services && (
          <div className="services-grid">
            {hotspot.content.services.map((service, index) => (
              <div key={index} className="service-card">
                <span className="service-icon">{service.icon}</span>
                <h4>{service.name}</h4>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
        
        {hotspot.content.projects && (
          <div className="projects-grid">
            {hotspot.content.projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-image">{project.image}</div>
                <div className="project-info">
                  <span className="project-category">{project.category}</span>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {hotspot.content.testimonials && (
          <div className="testimonials">
            {hotspot.content.testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial">
                <blockquote>"{testimonial.quote}"</blockquote>
                <cite>
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.company}</span>
                </cite>
              </div>
            ))}
          </div>
        )}
        
        <button className="cta-button">
          {hotspot.content.cta}
        </button>
      </div>
    </div>
  );
}

// Contact Modal Component
function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Replace with your actual GHL webhook URL
  const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/[YOUR_WEBHOOK_ID]';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Submit to GoHighLevel
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Standard GHL contact fields
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: '', // Add phone field if needed
          // Custom fields
          budget: formData.budget,
          message: formData.message,
          source: 'Oasis Website 3D Form',
          // Additional tracking
          tags: ['website-lead', '3d-contact-form'],
          customFields: {
            budget_range: formData.budget,
            project_details: formData.message,
            lead_source: 'Interactive 3D Website'
          }
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Track analytics event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contact_form_submit', {
            event_category: 'Lead Generation',
            event_label: 'Success',
            value: 1
          });
        }
        
        // Reset form and close after delay
        setTimeout(() => {
          setFormData({ name: '', email: '', budget: '', message: '' });
          onClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Track error event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_error', {
          event_category: 'Lead Generation',
          event_label: 'Error',
          value: 0
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Start Your Project</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="contact-form">
          <p>Tell us about your idea and we'll reply within 1 business day.</p>
          
          {submitStatus === 'success' && (
            <div className="success-message">
              <span className="success-icon">🎉</span>
              <h3>Thank you!</h3>
              <p>We've received your message and will get back to you soon.</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <h3>Oops!</h3>
              <p>Something went wrong. Please try again or email us directly.</p>
            </div>
          )}
          
          {submitStatus !== 'success' && (
            <>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isSubmitting}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isSubmitting}
                />
              </div>
              
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                disabled={isSubmitting}
              >
                <option value="">Budget Range</option>
                <option value="5k-15k">$5k - $15k</option>
                <option value="15k-30k">$15k - $30k</option>
                <option value="30k-50k">$30k - $50k</option>
                <option value="50k+">$50k+</option>
              </select>
              
              <textarea
                placeholder="Tell us about your project..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                disabled={isSubmitting}
              />
              
              <button 
                onClick={handleSubmit} 
                className="submit-btn"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function OasisShowcase() {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [hoveredHotspot, setHoveredHotspot] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  // Replace with your GHL newsletter webhook URL
  const GHL_NEWSLETTER_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/[YOUR_NEWSLETTER_WEBHOOK_ID]';

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail) return;
    
    setNewsletterStatus('loading');
    
    try {
      const response = await fetch(GHL_NEWSLETTER_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'Oasis Website Newsletter',
          tags: ['newsletter-signup', 'website-visitor'],
          customFields: {
            signup_source: 'Interactive 3D Website Newsletter'
          }
        })
      });

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        
        // Track analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'newsletter_signup', {
            event_category: 'Engagement',
            event_label: 'Success'
          });
        }
        
        setTimeout(() => setNewsletterStatus(null), 3000);
      } else {
        throw new Error('Newsletter signup failed');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(null), 3000);
    }
  };

  return (
    <div className="app">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, ${theme.colors.night} 0%, #0f0f0f 100%);
          color: ${theme.colors.white};
          overflow: hidden;
        }
        
        .app {
          height: 100vh;
          position: relative;
        }
        
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: ${theme.spacing.lg};
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: ${theme.colors.primary};
        }
        
        .nav {
          display: flex;
          gap: ${theme.spacing.lg};
        }
        
        .nav a {
          color: ${theme.colors.white};
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .nav a:hover {
          color: ${theme.colors.primary};
        }
        
        .scene-container {
          width: 100%;
          height: 100vh;
        }
        
        .hero-text {
          position: fixed;
          top: 50%;
          left: 50px;
          transform: translateY(-50%);
          z-index: 50;
          max-width: 400px;
        }
        
        .hero-text h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: ${theme.spacing.md};
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.golden});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-text p {
          font-size: 1.2rem;
          margin-bottom: ${theme.spacing.xl};
          color: ${theme.colors.cream};
          line-height: 1.6;
        }
        
        .cta-button, .submit-btn {
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.coral});
          color: white;
          border: none;
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          border-radius: ${theme.borderRadius.full};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: ${theme.shadows.lg};
        }
        
        .cta-button:hover, .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.xl};
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .success-message,
        .error-message {
          text-align: center;
          padding: ${theme.spacing.xl};
          border-radius: ${theme.borderRadius.lg};
          margin-bottom: ${theme.spacing.lg};
        }
        
        .success-message {
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(255, 181, 71, 0.1));
          border: 1px solid ${theme.colors.teal};
        }
        
        .error-message {
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 142, 83, 0.1));
          border: 1px solid ${theme.colors.primary};
        }
        
        .success-icon,
        .error-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: ${theme.spacing.md};
        }
        
        .success-message h3,
        .error-message h3 {
          color: ${theme.colors.primary};
          margin-bottom: ${theme.spacing.sm};
        }
        
        .side-panel {
          position: fixed;
          right: 0;
          top: 0;
          width: 400px;
          height: 100vh;
          background: rgba(44, 44, 44, 0.95);
          backdrop-filter: blur(20px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: ${theme.spacing.xl};
          overflow-y: auto;
          z-index: 200;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
          padding-bottom: ${theme.spacing.lg};
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .panel-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.8rem;
          color: ${theme.colors.primary};
        }
        
        .close-btn {
          background: none;
          border: none;
          color: ${theme.colors.white};
          font-size: 2rem;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: ${theme.borderRadius.sm};
          transition: background 0.3s ease;
        }
        
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .subtitle {
          color: ${theme.colors.teal};
          font-size: 1.1rem;
          margin-bottom: ${theme.spacing.lg};
        }
        
        .body-text p {
          margin-bottom: ${theme.spacing.md};
          line-height: 1.6;
          color: ${theme.colors.cream};
        }
        
        .services-grid {
          display: grid;
          gap: ${theme.spacing.lg};
          margin: ${theme.spacing.xl} 0;
        }
        
        .service-card {
          background: rgba(255, 255, 255, 0.05);
          padding: ${theme.spacing.lg};
          border-radius: ${theme.borderRadius.lg};
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        
        .service-icon {
          font-size: 2rem;
          margin-bottom: ${theme.spacing.sm};
          display: block;
        }
        
        .service-card h4 {
          color: ${theme.colors.primary};
          margin-bottom: ${theme.spacing.sm};
        }
        
        .projects-grid {
          display: grid;
          gap: ${theme.spacing.lg};
          margin: ${theme.spacing.xl} 0;
        }
        
        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: ${theme.borderRadius.lg};
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .project-card:hover {
          transform: translateY(-2px);
          box-shadow: ${theme.shadows.lg};
        }
        
        .project-image {
          height: 120px;
          background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.teal});
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
        }
        
        .project-info {
          padding: ${theme.spacing.lg};
        }
        
        .project-category {
          background: ${theme.colors.teal};
          color: ${theme.colors.charcoal};
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          border-radius: ${theme.borderRadius.sm};
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .project-info h4 {
          margin: ${theme.spacing.sm} 0;
          color: ${theme.colors.white};
        }
        
        .testimonials {
          margin: ${theme.spacing.xl} 0;
        }
        
        .testimonial {
          background: rgba(255, 255, 255, 0.05);
          padding: ${theme.spacing.lg};
          border-radius: ${theme.borderRadius.lg};
          margin-bottom: ${theme.spacing.lg};
          border-left: 4px solid ${theme.colors.primary};
        }
        
        .testimonial blockquote {
          font-style: italic;
          margin-bottom: ${theme.spacing.md};
          line-height: 1.6;
        }
        
        .testimonial cite {
          display: block;
          font-style: normal;
        }
        
        .testimonial cite strong {
          color: ${theme.colors.primary};
          display: block;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: ${theme.colors.charcoal};
          border-radius: ${theme.borderRadius.xl};
          padding: ${theme.spacing.xxl};
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: ${theme.spacing.xl};
        }
        
        .modal-header h2 {
          font-family: 'Space Grotesk', sans-serif;
          color: ${theme.colors.primary};
        }
        
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing.lg};
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: ${theme.spacing.md};
        }
        
        .contact-form input,
        .contact-form select,
        .contact-form textarea {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.md};
          color: ${theme.colors.white};
          font-family: inherit;
        }
        
        .contact-form input::placeholder,
        .contact-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .contact-form input:focus,
        .contact-form select:focus,
        .contact-form textarea:focus {
          outline: none;
          border-color: ${theme.colors.primary};
          box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
        }
        
        .newsletter {
          position: fixed;
          bottom: ${theme.spacing.xl};
          left: ${theme.spacing.xl};
          background: rgba(44, 44, 44, 0.9);
          backdrop-filter: blur(20px);
          padding: ${theme.spacing.lg};
          border-radius: ${theme.borderRadius.lg};
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .newsletter h3 {
          margin-bottom: ${theme.spacing.sm};
          color: ${theme.colors.primary};
        }
        
        .newsletter-form {
          display: flex;
          gap: ${theme.spacing.sm};
        }
        
        .newsletter input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          color: ${theme.colors.white};
          min-width: 200px;
        }
        
        .newsletter input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        
        .newsletter button {
          background: ${theme.colors.teal};
          color: ${theme.colors.charcoal};
          border: none;
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          border-radius: ${theme.borderRadius.md};
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .newsletter button:hover {
          background: ${theme.colors.primary};
          color: white;
        }
        
        .newsletter button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .newsletter-success,
        .newsletter-error {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.sm};
          padding: ${theme.spacing.md};
          border-radius: ${theme.borderRadius.md};
          font-size: 0.9rem;
        }
        
        .newsletter-success {
          background: rgba(78, 205, 196, 0.1);
          color: ${theme.colors.teal};
          border: 1px solid ${theme.colors.teal};
        }
        
        .newsletter-error {
          background: rgba(255, 107, 53, 0.1);
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
        }
        
        .tooltip {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(44, 44, 44, 0.9);
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          border-radius: ${theme.borderRadius.md};
          color: ${theme.colors.white};
          font-size: 0.9rem;
          z-index: 100;
        }
        
        @media (max-width: 768px) {
          .hero-text {
            left: ${theme.spacing.lg};
            max-width: 300px;
          }
          
          .hero-text h1 {
            font-size: 2rem;
          }
          
          .side-panel {
            width: 100%;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .newsletter {
            left: ${theme.spacing.md};
            right: ${theme.spacing.md};
          }
          
          .newsletter-form {
            flex-direction: column;
          }
          
          .newsletter input {
            min-width: auto;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
      
      <header className="header">
        <div className="logo">OASIS</div>
        <nav className="nav">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#contact" onClick={(e) => {
            e.preventDefault();
            setContactModalOpen(true);
          }}>Contact</a>
        </nav>
      </header>
      
      <div className="hero-text">
        <h1>Imagine. Build. Delight.</h1>
        <p>We design interactive brands and experiences that move people.</p>
        <button 
          className="cta-button"
          onClick={() => setContactModalOpen(true)}
        >
          Start a Project →
        </button>
      </div>
      
      <div className="scene-container">
        <Suspense fallback={<div>Loading...</div>}>
          <Canvas shadows>
            <Scene 
              activeHotspot={activeHotspot}
              setActiveHotspot={setActiveHotspot}
              setHoveredHotspot={setHoveredHotspot}
            />
          </Canvas>
        </Suspense>
      </div>
      
      {hoveredHotspot && (
        <div className="tooltip">
          Click to explore {hoveredHotspot}
        </div>
      )}
      
      <SidePanel 
        activeHotspot={activeHotspot}
        onClose={() => setActiveHotspot(null)}
      />
      
      <ContactModal 
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
      
      <div className="newsletter">
        <h3>Stay Updated</h3>
        {newsletterStatus === 'success' ? (
          <div className="newsletter-success">
            <span>✅</span>
            <span>Thanks for subscribing!</span>
          </div>
        ) : newsletterStatus === 'error' ? (
          <div className="newsletter-error">
            <span>❌</span>
            <span>Something went wrong. Try again.</span>
          </div>
        ) : (
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={newsletterStatus === 'loading'}
            />
            <button 
              onClick={handleNewsletterSubmit}
              disabled={!newsletterEmail || newsletterStatus === 'loading'}
            >
              {newsletterStatus === 'loading' ? (
                <>
                  <span className="spinner"></span>
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}