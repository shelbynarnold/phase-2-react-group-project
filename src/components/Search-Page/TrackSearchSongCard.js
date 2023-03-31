import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button, Dropdown } from "react-bootstrap";
import { BsSpotify, BsList } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const TrackSearchSongCard = ({ track, handleLikedSong, allPlaylists, setAllPlaylists, generalToggle, setGeneralToggle }) => {

    const [isLiked, setIsLiked] = useState(false);
    const [isPlaylistClicked, setIsPlaylistClicked] = useState(false);

    const history = useHistory();

    const likedSong = {
        song_id: track.id,
        song_name: track.name,
        song_link: track.external_urls.spotify,
        artists_id: track.artists[0].id,
        artists: track.artists[0].name,
        artists_link: track.artists[0].external_urls.spotify,
        album_id: track.album.id,
        album_name: track.album.name,
        album_link: track.album.external_urls.spotify,
        image: track.album.images[0].url,
        popularity: track.popularity,
        preview_url: track.preview_url
    }

    const dropDownOptions = () => {
        return allPlaylists.map((playlist) => {
            // console.log(playlist.songs)
            return <Dropdown.Item onClick={() => handleAddToPlaylist(playlist)}>{playlist.name}</Dropdown.Item>
        })
    }
    
    const handleAddToPlaylist = (playlist) => {
        console.log(playlist.songs)
        // console.log(likedSong)
        fetch(`http://localhost:8000/playlists/${playlist.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                songs: [
                    ...playlist.songs,
                    likedSong
                ]
            })
        })
        .then((response) => response.json())
        .then((addedSongData) => console.log(addedSongData))
        setAllPlaylists([...allPlaylists, likedSong])
        setGeneralToggle(!generalToggle)
    }

    const onLikeButtonClick = () => {
        setIsLiked(!isLiked)
        console.log(track)
        handleLikedSong(likedSong)
    }

    const handleCreateNewPlaylist = () => {
        history.push({pathname:"/playlists/new-playlist"})
    }

    return (
        <Card>
        <br></br>
        <Card.Img src={track.album.images[0]?.url || process.env.PUBLIC_URL + "logo192.png"} />         
        <Card.Body>
            <Card.Title>{track.name}</Card.Title>
            <Card.Text>{track.artists[0].name}</Card.Text>
        </Card.Body>
        {/* <Button onClick={() => handleLikedSong(likedSong)}>Like Song</Button> */}
        <span style={{display:"block", marginTop:"25px", marginBottom:"-5px", zIndex:"10"}}>
            {isLiked ? 
            <FaHeart onClick={() => window.alert("You've already liked this post!")} style={{cursor:"pointer", marginRight:"125px", scale:"2.5", color:"#E31B23"}} />            
            : <FaRegHeart onClick={onLikeButtonClick} style={{cursor:"pointer", marginRight:"125px", color:"#E31B23", scale:"2.5"}} />
            }
            <a href={track.external_urls.spotify} target="_blank">
                <BsSpotify onClick={() => console.log(track.external_urls.spotify)} style={{cursor:"pointer", color:"#1DB954", scale:"2.5"}} />
            </a>
        </span>
        <span style={{display:"inline-flex", marginTop:"50px", zIndex:"10", justifyContent:"space-between", alignItems:"center"}}>
            <audio controls name="media" style={{marginBottom:"15px", width:"200px"}}>
                <source src={track.preview_url} alt="no preview available" type="audio/mp3" />
            </audio>
            <Dropdown>
                <Dropdown.Toggle variant="none" style={{marginBottom:"15px"}}>
                    <BsList type="select" onClick={() => setIsPlaylistClicked(!isPlaylistClicked)} style={{display:"inline-flex", cursor:"pointer", scale:"1.75", zIndex:"10"}} />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <span style={{display:"flex", justifyContent:"center"}}><strong>Add to...</strong></span>
                    <Dropdown.Item onClick={() => handleCreateNewPlaylist()}>New Playlist</Dropdown.Item>
                {dropDownOptions()}
                </Dropdown.Menu>
            </Dropdown>
        </span>
        {/* <video controls name="media" style={{marginBottom:"15px"}}>
            <source src={track.preview_url} alt="no preview available" type="audio/mp3" />
        </video> */}
        </Card>
    )
}

export default TrackSearchSongCard;