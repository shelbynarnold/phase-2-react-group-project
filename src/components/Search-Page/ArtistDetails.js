import { useEffect, useState } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { Container, Row, Card, ListGroup, Header, Button } from "react-bootstrap";
import { BsSpotify } from "react-icons/bs";

const ArtistDetails = ( { accessToken } ) => {

    const [topTracks, setTopTracks] = useState([]);
    const [albums, setAlbums] = useState([]);

    const history = useHistory();
    const location = useLocation();
    const id = location.state.id;
    const data = location.state;
    console.log(location.state)
    const FETCH_URL = location.state.href;
    // console.log(id)
    // console.log(location.state.href)

    // Gives the same information as the location.state as is:
    useEffect(() => {
        if (data.type === "artist") {
            fetch(`https://api.spotify.com/v1/${data.type}s/${id}/top-tracks?market=US`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("here's the data:", data.tracks)
                setTopTracks(data.tracks)
            })
        }
    }, [])

    useEffect(() => {
        if (data.type === "artist") {
            fetch(`https://api.spotify.com/v1/${data.type}s/${id}/albums?market=US`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log("ALBUM DATA:", data.items)
                setAlbums(data.items)
            })
        }
    }, [])

    const renderTopTracks = topTracks.map((track) => {
        return (
            <ListGroup.Item style={{position:"relative", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <img style={{height:"50px", borderRadius:"7.5px"}} src={track.album.images[0]?.url || process.env.PUBLIC_URL + "logo192.png"}></img>
                <span style={{position:"absolute", left:"100px"}} >{track.name} - {track.album.name}</span>
                {track.preview_url !== null ?
                    <video controls name="media" style={{position:"absolute", right:"75px", height:"50px", width:"350px", alignItems:"center", justifyContent:"flex-end"}}>
                    <source src={track.preview_url} alt="no preview available" type="audio/mp3" />
                    </video>
                : <span style={{position:"absolute", right:"160px"}}>Preview Not Available</span>}
                <a href={track.external_urls.spotify} target="_blank">
                    <BsSpotify onClick={() => console.log(track.external_urls.spotify)} style={{cursor:"pointer", color:"#1DB954", scale:"2.5"}} />
                </a>
            </ListGroup.Item>
        )
    })

    const renderAlbums = albums.map((album) => {
        return (
            <Card onClick={() => history.push({pathname:`/search/album/${album.name}/details`, state:album})}>
                <Card.Body>
                    <Card.Img src={album.images[0]?.url || process.env.PUBLIC_URL + "logo192.png"} />
                    <br></br><br></br>
                    <Card.Title>{album.name}</Card.Title>
                </Card.Body>
            </Card>
        )
    })
    // const handleAlbumClick = (albumFetchUrl) => {
    //     fetch(`${albumFetchUrl}/tracks`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": "Bearer " + accessToken
    //         }
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //         console.log("ALBUM FETCH DATA:", data.items)
    //         // setAlbumTracks(data.items)
    //     })
    // }

    const { category } = useParams();

    return (
        <div>
            <Container>
                <br></br><br></br>
                <Row className="mx-2 row row-cols-4">
                    <Card style={{margin:"auto"}}>
                        <Card.Body>
                        <Card.Img src={data.images[0]?.url || process.env.PUBLIC_URL + "logo192.png"} />
                            <br></br><br></br>
                            <Card.Title>{data.name}</Card.Title>
                            <Card.Text>Followers: {data.followers.total}</Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
            <br></br><br></br>
            <h2>Top Songs</h2>
            <br></br>
            <Container>
                <ListGroup>
                    {renderTopTracks}
                </ListGroup>
            </Container>
            <br></br><br></br>
            <h2>Top Albums</h2>
            <br></br>
            <Container>
                <Row className="mx-2 row row-cols-4">
                    {renderAlbums}
                </Row>
            </Container>

        </div>
    )
}

export default ArtistDetails;