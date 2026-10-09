import React, { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OnboardingTour() {
    const { profile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [hasSeenTour, setHasSeenTour] = useState(localStorage.getItem('athena_tour_completed'));

    useEffect(() => {
        // Run Part 1 of the tour on the Hub page
        if (profile && !hasSeenTour && location.pathname === '/hub' && !localStorage.getItem('athena_tour_in_progress')) {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                smoothScroll: true,
                allowClose: false,
                overlayColor: 'rgba(0, 0, 0, 0.7)',
                popoverClass: 'athena-theme-driver',
                steps: [
                    {
                        element: 'body',
                        popover: {
                            title: 'Welcome to <span class="font-serif italic text-white">Athena.</span>',
                            description: 'Let us take you on a quick tour of your new academic workspace.',
                            side: 'center',
                            align: 'center'
                        }
                    },
                    {
                        element: '.nav-hub-link',
                        popover: {
                            title: 'The Hub',
                            description: 'Your dashboard for upcoming exams, events, and quick actions.',
                            side: 'bottom',
                        }
                    },
                    {
                        element: '.nav-calendar-link',
                        popover: {
                            title: 'Academic Calendar',
                            description: 'Track MSTs, ESTs, and holidays seamlessly.',
                            side: 'bottom',
                        }
                    },
                    {
                        element: '.nav-sgpa-btn',
                        popover: {
                            title: 'SGPA Calculator',
                            description: 'Predict your SGPA instantly using this handy tool.',
                            side: 'bottom',
                        }
                    },
                    {
                        element: '.nav-notes-link',
                        popover: {
                            title: 'Notes Repository',
                            description: 'Access the vault of academic notes. Let\'s head there now to see the PDF Viewer!',
                            side: 'bottom',
                            onNextClick: () => {
                                localStorage.setItem('athena_tour_in_progress', 'true');
                                driverObj.destroy();
                                navigate('/notes?tour=true');
                            }
                        }
                    }
                ],
                onDestroyStarted: () => {
                    if (driverObj.hasNextStep() || driverObj.isLastStep()) {
                        driverObj.destroy();
                    }
                }
            });

            setTimeout(() => {
                driverObj.drive();
            }, 1000);
            
            return () => driverObj.destroy();
        }
    }, [profile, hasSeenTour, location.pathname, navigate]);

    // Handle Part 2 of the tour on Notes page
    useEffect(() => {
        if (location.pathname === '/notes' && location.search.includes('tour=true') && !hasSeenTour) {
            
            const runNotesTour = () => {
                const driverObj = driver({
                    showProgress: true,
                    animate: true,
                    smoothScroll: true,
                    allowClose: false,
                    overlayColor: 'rgba(0, 0, 0, 0.7)',
                    popoverClass: 'athena-theme-driver',
                    steps: [
                        {
                            element: '.notes-grid',
                            popover: {
                                title: 'Note Repository',
                                description: 'All your course notes are beautifully organized here by semester and unit.',
                                side: 'top',
                                align: 'start'
                            }
                        },
                        {
                            element: '.pdf-rotate-btn',
                            popover: {
                                title: 'Sleek PDF Viewer',
                                description: 'We automatically opened a note for you! Check out the PDF controls, including the rotation feature for those awkwardly scanned pages.',
                                side: 'bottom',
                                align: 'center'
                            }
                        },
                        {
                            element: 'body',
                            popover: {
                                title: 'Tour Complete',
                                description: 'You\'re all set to conquer your curriculum. Enjoy exploring Athena!',
                                side: 'center',
                                align: 'center'
                            }
                        }
                    ],
                    onDestroyStarted: () => {
                        localStorage.setItem('athena_tour_completed', 'true');
                        localStorage.removeItem('athena_tour_in_progress');
                        setHasSeenTour(true);
                        driverObj.destroy();
                        navigate('/notes', { replace: true });
                    }
                });
                
                driverObj.drive();
            };

            // Wait for the PDF to be automatically opened by Notes.jsx (1.5s delay) + extra time for modal animation
            const timer = setTimeout(() => {
                runNotesTour();
            }, 2500);
            
            return () => clearTimeout(timer);
        }
    }, [location, hasSeenTour, navigate]);

    return null;
}
