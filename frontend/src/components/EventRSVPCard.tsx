import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  UserCheck,
  UserX,
  HelpCircle,
  CheckCircle 
} from 'lucide-react';
import { useProfile } from '@/hooks/useAuth';
import { useCreateOrUpdateRSVP, useDeleteRSVP, useUserRSVPs } from '@/hooks/useRSVP';
import { toast } from 'sonner';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity?: number;
  registeredCount?: number;
  speaker?: {
    name: string;
    role: string;
    company?: string;
    bio?: string;
  };
}

interface EventRSVPCardProps {
  event: Event;
  showFullDetails?: boolean;
}

const EventRSVPCard: React.FC<EventRSVPCardProps> = ({ 
  event, 
  showFullDetails = true 
}) => {
  const { data: profile } = useProfile();
  const { data: userRSVPs } = useUserRSVPs();
  const createOrUpdateRSVPMutation = useCreateOrUpdateRSVP();
  const deleteRSVPMutation = useDeleteRSVP();
  
  const [isLoading, setIsLoading] = useState(false);

  // Find current user's RSVP for this event
  const currentRSVP = userRSVPs?.find(rsvp => rsvp.eventId === event._id);

  const handleRSVP = async (status: 'attending' | 'not_attending' | 'maybe') => {
    if (!profile) {
      toast.error('Please login to RSVP to events');
      return;
    }

    setIsLoading(true);
    try {
      await createOrUpdateRSVPMutation.mutateAsync({
        eventId: event._id,
        status
      });
    } catch (error) {
      console.error('RSVP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    if (!currentRSVP) return;

    setIsLoading(true);
    try {
      await deleteRSVPMutation.mutateAsync(event._id);
    } catch (error) {
      console.error('Cancel RSVP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Time TBA';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventPast = new Date(event.date) < new Date();
  const isEventToday = new Date(event.date).toDateString() === new Date().toDateString();

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Event Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                <Badge 
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800"
                >
                  {event.category}
                </Badge>
                {isEventToday && (
                  <Badge className="bg-green-100 text-green-800">
                    Today
                  </Badge>
                )}
                {isEventPast && (
                  <Badge variant="destructive">
                    Past Event
                  </Badge>
                )}
              </div>
              {showFullDetails && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="font-medium">{formatDate(event.date)}</p>
                <p className="text-sm text-gray-500">{formatTime(event.time)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-700">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            {event.capacity && (
              <div className="flex items-center space-x-3 text-gray-700">
                <Users className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium">
                    {event.registeredCount || 0} / {event.capacity} registered
                  </p>
                  <p className="text-sm text-gray-500">
                    {event.capacity - (event.registeredCount || 0)} spots remaining
                  </p>
                </div>
              </div>
            )}

            {event.speaker && (
              <div className="flex items-center space-x-3 text-gray-700">
                <UserCheck className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium">{event.speaker.name}</p>
                  <p className="text-sm text-gray-500">
                    {event.speaker.role}
                    {event.speaker.company && ` at ${event.speaker.company}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Current RSVP Status */}
          {currentRSVP && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  currentRSVP.status === 'attending' ? 'bg-green-500' :
                  currentRSVP.status === 'maybe' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <p className="text-sm font-medium text-gray-700">
                  Your RSVP: <span className="capitalize">{currentRSVP.status.replace('_', ' ')}</span>
                </p>
                <p className="text-xs text-gray-500">
                  • Registered on {new Date(currentRSVP.registrationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* RSVP Actions */}
          {!isEventPast && profile && (
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleRSVP('attending')}
                  disabled={isLoading || createOrUpdateRSVPMutation.isPending}
                  className={`flex items-center space-x-2 ${
                    currentRSVP?.status === 'attending' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {currentRSVP?.status === 'attending' ? 'Attending' : 'I\'ll Attend'}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleRSVP('maybe')}
                  disabled={isLoading || createOrUpdateRSVPMutation.isPending}
                  className={`flex items-center space-x-2 ${
                    currentRSVP?.status === 'maybe' 
                      ? 'border-yellow-500 text-yellow-600 bg-yellow-50' 
                      : ''
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Maybe</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleRSVP('not_attending')}
                  disabled={isLoading || createOrUpdateRSVPMutation.isPending}
                  className={`flex items-center space-x-2 ${
                    currentRSVP?.status === 'not_attending' 
                      ? 'border-red-500 text-red-600 bg-red-50' 
                      : ''
                  }`}
                >
                  <UserX className="h-4 w-4" />
                  <span>Can\'t Attend</span>
                </Button>

                {currentRSVP && (
                  <Button
                    variant="ghost"
                    onClick={handleCancelRSVP}
                    disabled={isLoading || deleteRSVPMutation.isPending}
                    className="text-gray-600 hover:text-red-600"
                  >
                    Cancel RSVP
                  </Button>
                )}
              </div>

              {isLoading && (
                <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Updating RSVP...</span>
                </div>
              )}
            </div>
          )}

          {/* Login Prompt */}
          {!isEventPast && !profile && (
            <div className="border-t pt-4 text-center">
              <p className="text-gray-600 mb-3">Please login to RSVP to this event</p>
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Login to RSVP
              </Button>
            </div>
          )}

          {/* Past Event Message */}
          {isEventPast && (
            <div className="border-t pt-4 text-center">
              <p className="text-gray-500">This event has already occurred</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventRSVPCard;