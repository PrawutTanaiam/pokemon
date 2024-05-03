import React from 'react'

export default function Child(props){
   return( 
   <>
    <p>{props.Home} </p>
    <p>{props.score} </p>
    <p>{props.away} </p>
    </>
   )
}