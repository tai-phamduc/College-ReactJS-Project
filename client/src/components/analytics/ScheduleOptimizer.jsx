import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaChartLine, FaExchangeAlt, FaLightbulb, FaMoneyBillWave, FaRobot, FaTheaterMasks, FaUsers } from 'react-icons/fa';
import scheduleOptimizationService from '../../services/scheduleOptimizationService';

const ScheduleOptimizer = ({ theaterId }) => {
  const [optimizedSchedule, setOptimizedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await scheduleOptimizationService.optimizeSchedule(theaterId || '1', selectedDate);
        setOptimizedSchedule(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching optimized schedule:', err);
        setError('Failed to generate optimized schedule');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [theaterId, selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!optimizedSchedule) {
    return (
      <div className="text-center py-8 text-gray-400">
        Unable to generate optimized schedule
      </div>
    );
  }

  return (
    <div className="bg-secondary rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaRobot className="text-primary mr-2" size={20} />
          <h3 className="text-lg font-semibold">AI Schedule Optimizer</h3>
        </div>
        <span className="text-xs bg-primary text-white px-2 py-1 rounded">AI Powered</span>
      </div>

      {/* Date Selector */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-blue-500 mr-2" />
          <h4 className="text-md font-semibold">Select Date</h4>
        </div>
        
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-gray-800 text-white p-2 rounded w-full"
          min={new Date().toISOString().split('T')[0]}
          max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
        />
      </div>

      {/* Schedule Metrics */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <FaChartLine className="text-green-500 mr-2" />
          <h4 className="text-md font-semibold">Projected Performance</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <FaUsers className="mx-auto text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{optimizedSchedule.metrics.totalAttendance}</div>
            <div className="text-sm text-gray-400">Expected Attendance</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <FaMoneyBillWave className="mx-auto text-green-500 mb-2" />
            <div className="text-2xl font-bold">{optimizedSchedule.metrics.revenueFormatted}</div>
            <div className="text-sm text-gray-400">Projected Revenue</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <FaTheaterMasks className="mx-auto text-purple-500 mb-2" />
            <div className="text-2xl font-bold">{optimizedSchedule.metrics.overallAttendancePercentage}%</div>
            <div className="text-sm text-gray-400">Occupancy Rate</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {optimizedSchedule.recommendations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <FaLightbulb className="text-yellow-500 mr-2" />
            <h4 className="text-md font-semibold">AI Recommendations</h4>
          </div>
          
          <div className="space-y-4">
            {optimizedSchedule.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start">
                  {recommendation.type === 'replace_movie' ? (
                    <FaExchangeAlt className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  ) : (
                    <FaLightbulb className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">{recommendation.message}</p>
                    
                    {recommendation.type === 'replace_movie' && (
                      <div className="mt-2 text-xs text-gray-400">
                        Expected improvement: +{recommendation.suggestion.expectedImprovement}% attendance
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimized Schedule */}
      <div>
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-purple-500 mr-2" />
          <h4 className="text-md font-semibold">Optimized Schedule</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Hall</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Time</th>
                <th className="py-2 px-4 border-b border-gray-700 text-left">Movie</th>
                <th className="py-2 px-4 border-b border-gray-700 text-right">Expected Attendance</th>
                <th className="py-2 px-4 border-b border-gray-700 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {optimizedSchedule.schedule.map((showtime, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="py-2 px-4 border-b border-gray-700">
                    {showtime.hall.name}
                    {showtime.hall.premium && (
                      <span className="ml-1 text-xs bg-yellow-600 text-white px-1 rounded">Premium</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    {showtime.startTime} - {showtime.endTime}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700">
                    <div className="flex items-center">
                      {showtime.movie.poster && (
                        <img
                          src={showtime.movie.poster}
                          alt={showtime.movie.title}
                          className="w-8 h-12 object-cover rounded mr-2"
                        />
                      )}
                      <div>
                        <div className="font-medium">{showtime.movie.title}</div>
                        <div className="text-xs text-gray-400">
                          {showtime.movie.duration} min | Popularity: {showtime.movie.popularityScore}/100
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700 text-right">
                    <div>{showtime.metrics.expectedAttendance} / {showtime.hall.capacity}</div>
                    <div className="text-xs text-gray-400">{showtime.metrics.attendancePercentage}%</div>
                  </td>
                  <td className="py-2 px-4 border-b border-gray-700 text-right">
                    ${showtime.metrics.expectedRevenue}
                    <div className="text-xs text-gray-400">${showtime.metrics.ticketPrice} per ticket</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">
        This AI-optimized schedule is based on predicted attendance and revenue. Actual results may vary.
      </div>
    </div>
  );
};

export default ScheduleOptimizer;
