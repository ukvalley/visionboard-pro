import { useState, useCallback } from 'react';
import visionBoardService from '../services/visionBoardService';

export const useVisionBoard = () => {
  const [visionBoards, setVisionBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVisionBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await visionBoardService.getAll();
      setVisionBoards(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vision boards');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVisionBoard = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await visionBoardService.getById(id);
      setCurrentBoard(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vision board');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVisionBoard = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await visionBoardService.create(data);
      setVisionBoards(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create vision board';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVisionBoard = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await visionBoardService.update(id, data);
      setVisionBoards(prev =>
        prev.map(board => (board._id === id ? response.data : board))
      );
      if (currentBoard?._id === id) {
        setCurrentBoard(response.data);
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update vision board';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  const updateSection = useCallback(async (id, sectionName, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await visionBoardService.updateSection(id, sectionName, data);
      if (currentBoard?._id === id) {
        setCurrentBoard(response.data);
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update section';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  const deleteVisionBoard = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await visionBoardService.delete(id);
      setVisionBoards(prev => prev.filter(board => board._id !== id));
      if (currentBoard?._id === id) {
        setCurrentBoard(null);
      }
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete vision board';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [currentBoard]);

  return {
    visionBoards,
    currentBoard,
    loading,
    error,
    fetchVisionBoards,
    fetchVisionBoard,
    createVisionBoard,
    updateVisionBoard,
    updateSection,
    deleteVisionBoard
  };
};

export default useVisionBoard;