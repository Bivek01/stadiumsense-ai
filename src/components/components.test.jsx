import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContextSimulator from './ContextSimulator';
import RecommendationPanel from './RecommendationPanel';
import ChatAssistant from './ChatAssistant';
import { normalContext } from '../data/mockContext';
import { PRIORITIES, GATES } from '../data/constants';

describe('UI Components', () => {

  describe('ContextSimulator', () => {
    it('renders without crashing and displays initial context values', () => {
      const setContext = vi.fn();
      render(<ContextSimulator context={normalContext} setContext={setContext} />);
      
      // Check title exists
      expect(screen.getByText('Simulation Parameters')).toBeInTheDocument();
      
      // Check minutes label shows correct value
      expect(screen.getByText('60 min')).toBeInTheDocument();
    });
  });

  describe('RecommendationPanel', () => {
    it('renders normal recommendation correctly', () => {
      const mockRecommendation = {
        priority: PRIORITIES.NORMAL,
        recommendedGate: GATES.GATE_B,
        message: 'Proceed to gateB for fastest entry.',
        tips: ['Use covered walkways']
      };

      render(<RecommendationPanel recommendation={mockRecommendation} />);
      
      expect(screen.getByText('normal')).toBeInTheDocument();
      expect(screen.getByText('Gate B')).toBeInTheDocument();
      expect(screen.getByText('Proceed to gateB for fastest entry.')).toBeInTheDocument();
      expect(screen.getByText('Use covered walkways')).toBeInTheDocument();
    });

    it('renders urgent priority correctly', () => {
      const mockRecommendation = {
        priority: PRIORITIES.URGENT,
        recommendedGate: null,
        message: 'Medical emergency! Seek help.',
        tips: []
      };

      render(<RecommendationPanel recommendation={mockRecommendation} />);
      
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.getByText('Medical emergency! Seek help.')).toBeInTheDocument();
    });
  });

  describe('ChatAssistant', () => {
    it('renders chat interface with initial message', () => {
      const mockRecommendation = {
        priority: PRIORITIES.NORMAL,
        recommendedGate: GATES.GATE_A,
        message: 'Go to A',
        tips: []
      };

      render(<ChatAssistant context={normalContext} recommendation={mockRecommendation} />);
      
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
      expect(screen.getByText(/Hi! I'm StadiumSense AI/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ask a question...')).toBeInTheDocument();
    });
  });

});
