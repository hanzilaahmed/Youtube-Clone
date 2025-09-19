import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import user_profile from '../../assets/user_profile.jpg';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';

const PlayVideo = () => {
  const { videoId } = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [ commentData , setCommentData] = useState([]);
    

  // Fetch video data when videoId changes
  useEffect(() => {
    const fetchVideoData = async () => {
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
      const res = await fetch(videoDetails_url);
      const data = await res.json();
      setApiData(data.items ? data.items[0] : null);
    };
    fetchVideoData();
  }, [videoId]);

  // Fetch channel data when apiData changes
  useEffect(() => {
    if (!apiData) return;
    const fetchChannelData = async () => {
      const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const res = await fetch(channelData_url);
      const data = await res.json();
      setChannelData(data.items ? data.items[0] : null);

      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`
      await fetch(comment_url).then(res=>res.json()).then(data=>setCommentData(data.items))
    };

    fetchChannelData();
  }, [apiData]);

  return (
    <div className='play-video'>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="YouTube Video Player"
      ></iframe>

      <h3>{apiData ? apiData.snippet.title : "Title here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16k"} Views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span><img src={like} alt="" />{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
          <span><img src={dislike} alt="" />Dislike</span>
          <span><img src={share} alt="" />8.5k</span>
          <span><img src={save} alt="" />Save</span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        {channelData && channelData.snippet?.thumbnails?.default?.url && (
          <img src={channelData.snippet.thumbnails.default.url} alt="channel logo" />
        )}
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="video-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : "Description Here"}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>

        {commentData.map((item , index) =>{
            return(
        <div key={index} className="comment">
          <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt="" />
          <div>
            <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
            <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
            <div className="comment-action">
              <img src={like} alt="" />
              <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
              <img src={dislike} alt="" />
            </div>
          </div>
        </div>
            )
        })}

      </div>
    </div>
  );
};

export default PlayVideo;
