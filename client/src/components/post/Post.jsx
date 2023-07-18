import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [description, setDescription] = useState(post.description);
  const [like, setLike] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );


  const queryClient = useQueryClient();

  const mutation = useMutation(
    () => {
      for (let i = 0; i < data.length; i++) {
        if(currentUser.id === data[i].userId){
          makeRequest.delete("/likes?postId=" + post.id);
          return makeRequest.post("/likes", { postId: post.id, like });
        }
       
      }     
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
        setLike(0)
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const mutation0 = useMutation(
    (newPost) => {
      return makeRequest.put("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const mutation1 = useMutation(
    (newPost) => {
      return makeRequest.post("/posts/historic", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const mutation2 = useMutation(
    (newPost) => {
      return makeRequest.post("/views", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["views"]);
      },
    }
  );


  const handleLike = () => {
    setLike(1)
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDislike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const handleChange = () => {    
    setUpdate(true); 
  };

  const handleUpdate = () => {
    mutation0.mutate({ id:   post.id, description });  
    mutation1.mutate({ description, title: '', postId: post.id });
    setUpdate(false)
  };

 useEffect(() => {    
    let like1 = 0;
    let dislike1 = 0;
    for (let i = 0; i < data.length; i++) {
      if(data[i].like === 0){        
        dislike1 +=1;
      }else{        
        like1 +=1;        
      }
    }
    setLikes(like1)
    setDislikes(dislike1)
  },[like]);


const onMouseMoveCaptureHandler = () => {
  mutation0.mutate({ postId:   post.id });
};

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>                             
            </div>         
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && post.userId === currentUser.id && (
                <div class="btn-group">
                {update === false ? 
                   <>
                  <div class="flexdirection">
                    <DeleteIcon />  <button  onClick={handleDelete}> delete</button> 
                    </div>
                    <div class="flexdirection">
                      <UpdateIcon/> <button  onClick={handleChange}> update</button> 
                    </div>
                   </>
                   :

                   <>
                     <div class="flexdirection">
                      <UpdateIcon/> <button  onClick={handleUpdate}> update</button> 
                    </div>
                   </>

                    }
                </div>          
              )}
        </div>
        {update === false ? 
        <div className="content" onMouseMoveCapture={onMouseMoveCaptureHandler.bind(post.id)}>
          <p>{post.description}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>
        :
         <div className="content"> 
            <input
              type="text"
              placeholder={`What's on your mind `} ///*${currentUser.name}?
              onChange={(e) => setDescription(e.target.value)}
              style={{width: "100%"}}
              value={description}
            />
         
         </div>
       }

        <div className="info">
         <div className="item">            
                <ThumbUpOffAltIcon onClick={handleLike} /> <text>{likes}</text>           
            </div>
            <div className="item">
              <ThumbDownOffAltIcon onClick={handleDislike}/> <text>{dislikes}</text>            
            </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
          <div className="item">
            <VisibilityIcon />
            Views
          </div>     
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
