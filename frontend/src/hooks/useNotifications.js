import { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/axiosConfig';

export const useNotifications = () => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [updatedReservations, setUpdatedReservations] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch unread message count
  const fetchUnreadMessages = useCallback(async () => {
    try {
      const response = await apiClient.get('/messages/unread-count');
      const count = response.data || 0;
      console.log('📧 Unread messages count:', count);
      setUnreadMessages(count);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
      setUnreadMessages(0);
    }
  }, []);

  // Fetch pending reservations count (for owners)
  const fetchPendingReservations = useCallback(async () => {
    try {
      const response = await apiClient.get('/reservations/incoming');
      const pending = response.data.filter(r => r.status === 'PENDING').length;
      setPendingReservations(pending);
    } catch (error) {
      console.error('Error fetching pending reservations:', error);
    }
  }, []);

  // Fetch updated reservations count (for tenants)
  const fetchUpdatedReservations = useCallback(async () => {
    try {
      const response = await apiClient.get('/reservations/my-reservations');
      // Count reservations that were updated (accepted/rejected) but not yet viewed
      const updated = response.data.filter(r => 
        (r.status === 'ACCEPTED' || r.status === 'REJECTED') && 
        !localStorage.getItem(`viewed_reservation_${r.id}`)
      ).length;
      console.log('📅 Updated reservations count:', updated);
      setUpdatedReservations(updated);
    } catch (error) {
      console.error('Error fetching updated reservations:', error);
      setUpdatedReservations(0);
    }
  }, []);

  // Mark reservation as viewed
  const markReservationAsViewed = useCallback((reservationId) => {
    localStorage.setItem(`viewed_reservation_${reservationId}`, 'true');
    setUpdatedReservations(prev => Math.max(0, prev - 1));
  }, []);

  // Fetch all notifications
  const fetchAllNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const userRole = sessionStorage.getItem('role');
      
      await fetchUnreadMessages();
      
      if (userRole === 'ROLE_OWNER') {
        await fetchPendingReservations();
      } else if (userRole === 'ROLE_TENANT') {
        await fetchUpdatedReservations();
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchUnreadMessages, fetchPendingReservations, fetchUpdatedReservations]);

  // Refresh notifications periodically
  useEffect(() => {
    fetchAllNotifications();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAllNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [fetchAllNotifications]);

  // Total notification count
  const totalCount = unreadMessages + pendingReservations + updatedReservations;

  return {
    unreadMessages,
    pendingReservations,
    updatedReservations,
    totalCount,
    loading,
    refresh: fetchAllNotifications,
    markReservationAsViewed
  };
};
