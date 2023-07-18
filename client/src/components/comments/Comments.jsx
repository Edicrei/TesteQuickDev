import { useContext, useState } from "react";
import "./comments.scss";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [description, setDescription] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [update1, setUpdate1] = useState(false);

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      console.log('data', res.data)
      return res.data;
    })
  );

  const queryClient = useQueryClient();

   
  const handleDelete = () => {
    mutation0.mutate({ id:   postId, description , stautus: 1 }); 
    mutation1.mutate(); 
  };



  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId , status: 0});
    setDesc("");
  };

  const mutation0 = useMutation(
    (newPost) => {
      return makeRequest.put("/comments", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const mutation1 = useMutation(
    (newPost) => {
      return makeRequest.put("/sendemail/", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );



  const handleChange = () => {    
    setUpdate1(true) 
  };

  const handleUpdate = () => {
    mutation0.mutate({ id:   postId, description });  
    mutation1.mutate(); 
    setUpdate(false)
  };



  return (
    <div className="comments">
      <div className="write">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
       
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment">
              <img src={"/upload/" + comment.profilePic} alt="" />
              {update1 === false ? 
              <div className="info">
                {comment.status === 0 ? 
                <>
                <span>{comment.name}</span>
                <p>{comment.description}</p>
                </>
                :
                  <span>Removido Pelo usuário</span>
                 }
              </div>
              :
              <div className="content"> 
                 <input
                   type="text"
                   placeholder={`What's on your mind `} 
                   onChange={(e) => setDescription(e.target.value)}
                   style={{width: "100%"}}
                   value={description}
                 />
              
              </div>
            }
              <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && comment.userId === currentUser.id && (
               <div class="btn-group">
                 <div class="flexdirection">
                      <div class="flexdirection">
                        <DeleteIcon />  <button  onClick={handleDelete}> delete</button> 
                        </div>
                        {comment.userId === currentUser.id ?
                            <div class="flexdirection">
                          {update1 === false ? 
                          <>
                            <UpdateIcon/> <button  onClick={handleChange}> update</button>
                            </>
                            :
                           <>
                             <UpdateIcon/> <button  onClick={handleUpdate}> update</button>
                           </>
                          }
                          </div>
                          :
                          null
                         }
                    </div>
                    </div>
                  

                    )}

            </div>
          ))}
    </div>
  );
};

export default Comments;
