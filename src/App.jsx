import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Music,
} from 'lucide-react';
import { playlist } from './AllSongsData';

const MusicPlayer = () => {
  // Sample music data - replace with actual files from /src/assets/musics and /src/assets/covers

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleProgressChange = (e) => {
    const clickX = e.nativeEvent.offsetX;
    const width = progressRef.current.offsetWidth;
    const newTime = (clickX / width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const selectTrack = (index) => {
    setCurrentTrack(index);
    setShowPlaylist(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 1 || currentTrack < playlist.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, repeatMode, volume]);

  const currentSong = playlist[currentTrack];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Main Player Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Album Art */}
          <div className="relative mb-8">
            <div className="w-72 h-72 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl overflow-hidden">
              <div className="w-full h-full bg-black/20 flex items-center justify-center">
                <Music className="w-24 h-24 text-white/60" />
              </div>
            </div>
          </div>

          {/* Song Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{currentSong.title}</h2>
            <p className="text-white/70 text-lg">{currentSong.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div
              ref={progressRef}
              className="h-2 bg-white/20 rounded-full cursor-pointer mb-2 relative overflow-hidden"
              onClick={handleProgressChange}
            >
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <div className="flex justify-between text-white/60 text-sm">
              <span>{formatTime(currentTime)}</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-6">
            <button
              onClick={toggleShuffle}
              className={`p-3 rounded-full transition-all ${isShuffled ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={previousTrack}
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={togglePlayPause}
              className="p-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>

            <button
              onClick={nextTrack}
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-3 rounded-full transition-all relative ${repeatMode > 0 ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full text-xs flex items-center justify-center text-black font-bold">1</span>
              )}
            </button>
          </div>
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-white font-semibold mb-4">Playlist</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlist.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => selectTrack(index)}
                  className={`w-full p-3 rounded-xl text-left transition-all ${index === currentTrack
                      ? 'bg-purple-500/30 border border-purple-400/50'
                      : 'bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{song.title}</p>
                      <p className="text-white/60 text-sm truncate">{song.artist}</p>
                    </div>
                    <span className="text-white/60 text-sm">{song.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentSong.audio} className='hidden'/>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(168, 85, 247, 0.4);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #a855f7, #ec4899);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 10px rgba(168, 85, 247, 0.4);
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;