# DevMeet

## authRouter
 -POST /signup
 -POST /login
 -POST /logout

## profileRouter
 -GET /profile/view
 -PATCH /profile/edit
 -PATCH /profile/password

## connectionRequestRouter
 -POST /request/send/interested/:userId  ---> -POST /request/send/:status/:userId  
 -POST /request/send/ignored/:userId    |___> 

 -POST /request/review/accepted/:requestId ---> -POST /request/review/:status/:requestId
 -POST /request/review/rejected/:requestId |___>

## userRouter
 -GET /user/requests 
 -GET /user/connections
 -GET /user/feed -Gets you the profiles of other users on platform 

## feed api


Status: ignore, interested, accepted, rejected