import React, { useState } from 'react';
import { Container, Section, Typography, Card, Tag, FadeInOnScroll, Button, BackButton } from '@components/common';
import type { SkillCategory } from './data';
import { resumeData } from './data';
import { Briefcase, GraduationCap, Mail, Phone, MapPin, Github, Linkedin, Globe, Download } from 'lucide-react';
import './Curriculo.css';

const Curriculo: React.FC = () => {
    const [activeSkillFilter, setActiveSkillFilter] = useState<string>('all');

    const filteredSkills = activeSkillFilter === 'all'
        ? resumeData.skills
        : resumeData.skills.filter(cat => cat.id === activeSkillFilter);

    const handlePrint = () => {
        window.print();
    };

    return (
        <Container className="curriculo-page">
            <FadeInOnScroll>
                <div style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
                    <BackButton to="/" />
                </div>

                <header className="curriculo-header">
                    <Typography variant="h1" className="gradient-text">{resumeData.header.name}</Typography>
                    <Typography variant="h3" color="secondary">{resumeData.header.role}</Typography>

                    <div className="curriculo-header__info">
                        <span className="curriculo-link-item">
                            <MapPin size={16} /> {resumeData.header.location}
                        </span>
                        <div className="curriculo-links">
                            <a href={`mailto:${resumeData.header.email}`} className="curriculo-link-item">
                                <Mail size={18} /> {resumeData.header.email}
                            </a>
                            <span className="curriculo-link-item">
                                <Phone size={18} /> {resumeData.header.phone}
                            </span>
                            <a href={resumeData.header.linkedin} target="_blank" rel="noopener noreferrer" className="curriculo-link-item">
                                <Linkedin size={18} /> LinkedIn
                            </a>
                            <a href={resumeData.header.github} target="_blank" rel="noopener noreferrer" className="curriculo-link-item">
                                <Github size={18} /> GitHub
                            </a>
                            <a href={resumeData.header.portfolio} target="_blank" rel="noopener noreferrer" className="curriculo-link-item">
                                <Globe size={18} /> Portfólio
                            </a>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <Button
                            variant="outline"
                            size="sm"
                            icon={<Download size={16} />}
                            onClick={handlePrint}
                        >
                            Download PDF
                        </Button>
                    </div>
                </header>

                <Section id="resumo">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Typography variant="h2">Resumo Profissional</Typography>
                    </div>
                    <Card variant="elevated" padding>
                        <Typography variant="body1">
                            {resumeData.summary}
                        </Typography>
                    </Card>
                </Section>

                <Section id="objetivo">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Typography variant="h2">Objetivo</Typography>
                    </div>
                    <Typography variant="body1" align="center" style={{ fontStyle: 'italic' }}>
                        "{resumeData.objective}"
                    </Typography>
                </Section>

                <Section id="habilidades">
                    <div style={{ marginBottom: '2rem' }}>
                        <Typography variant="h2">Habilidades Técnicas</Typography>
                    </div>
                    <div className="skill-filters">
                        <Tag
                            clickable
                            variant={activeSkillFilter === 'all' ? 'brand' : 'default'}
                            onClick={() => setActiveSkillFilter('all')}
                        >
                            Todas
                        </Tag>
                        {resumeData.skills.map((cat: SkillCategory) => (
                            <Tag
                                key={cat.id}
                                clickable
                                variant={activeSkillFilter === cat.id ? 'brand' : 'default'}
                                onClick={() => setActiveSkillFilter(cat.id)}
                            >
                                {cat.title}
                            </Tag>
                        ))}
                    </div>

                    <div className="skills-container">
                        {filteredSkills.map(cat => (
                            <FadeInOnScroll key={cat.id}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <Typography variant="h4" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                                        {cat.title}
                                    </Typography>
                                    <div className="skills-grid">
                                        {cat.skills.map(skill => (
                                            <Tag key={skill} variant="default" size="md">
                                                {skill}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </Section>

                <Section id="experiencia">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                        <Briefcase size={28} />
                        <Typography variant="h2">Experiência Profissional</Typography>
                    </div>
                    <div className="curriculo-timeline">
                        {resumeData.experience.map((job) => (
                            <FadeInOnScroll key={job.id}>
                                <div className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <Card hover variant="outlined" className="experience-card">
                                        <div className="experience-card-header">
                                            <div className="experience-company-info">
                                                <Typography variant="h3">{job.company}</Typography>
                                                <Typography variant="h4" color="secondary">{job.role}</Typography>
                                            </div>
                                            <div className="experience-meta">
                                                <Typography variant="body2" weight="bold">{job.period}</Typography>
                                                <Typography variant="caption">{job.location}</Typography>
                                            </div>
                                        </div>

                                        <ul className="experience-description">
                                            {job.description.map((desc, idx) => (
                                                <li key={idx}>
                                                    <Typography variant="body2">{desc}</Typography>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="tech-stack">
                                            {job.technologies.map(tech => (
                                                <Tag key={tech} size="sm" variant="default" style={{ opacity: 0.8 }}>
                                                    {tech}
                                                </Tag>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </Section>

                <Section id="formacao">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                        <GraduationCap size={28} />
                        <Typography variant="h2">Formação Acadêmica</Typography>
                    </div>
                    <div className="curriculo-timeline">
                        {resumeData.education.map(edu => (
                            <FadeInOnScroll key={edu.id}>
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: 'var(--color-secondary, #2ecc71)' }}></div>
                                    <Card variant="default">
                                        <Typography variant="h3">{edu.institution}</Typography>
                                        <Typography variant="h4" color="secondary">{edu.degree}</Typography>
                                        <div className="experience-meta" style={{ marginTop: '0.5rem', textAlign: 'left' }}>
                                            <Typography variant="body2" weight="bold">{edu.period}</Typography>
                                            <Typography variant="caption">{edu.location}</Typography>
                                        </div>
                                    </Card>
                                </div>
                            </FadeInOnScroll>
                        ))}
                    </div>
                </Section>
            </FadeInOnScroll>
        </Container>
    );
};

export default Curriculo;
