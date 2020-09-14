# this is for development prupose only
Dockerfile.dev 


dev_nginx:
check docker-compose.yml


prod_nginx:
We have added a new nginx folde inside the client folder
check each Dockerfile per folder



Dockerrun.aws.json: documentation at:
 https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definitions


{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "client", // this is that will show up on the dashbord, there is no requirement to be the same as the folder name 
      "image": "kansodocker/multi-client", // when AWS sees this, it will go to docker hub  mainly the repo "kansodocker" and download the image
      "hostname": "client", // this name where other conatiners will use to connect to this container "check nginx routing"
      "essential": false, // this container is not essential means if it crashes do nothing for the other conatiners, if yes if it crashes all the other container in the group with shutdown
      "memory": 128
    },
    .
    .
    {
      "name": "nginx", 
      "image": "kansodocker/multi-nginx",
      "essential": true, 
      //NB no need to add hostname because no machine will reach to nginx 
      "portMappings": [
        {
          "hostPort": 80, // hosting machine that hosting all the conatiners
          "containerProt": 80 // conatiner port
        }
      ],
      "links": ["client", "server"], //in order to let nginx to know the endpoints where trafic will be redirected,
      "memory": 128
    }
  ]
}

>>> >>>>>>>>>>>>>>>
For DB usage we will rely on  AWS Relational Database Service (RDS)
 > Automatically creates and maintains Postgres instance for you
 > Super easy to scale
 > Built in logging + maintenance
 > Probably better security than what we can do 
 > Automated backups and rollbacks
 > Easier to migrate off of EB with

For Redis usage we will rely on AWS Elastic Cache (EC)
 > Automatically creates and maintains Redis instances for you
 > Super easy to scale
 > Probably better security than what we can do
 > Easier to migrate off of EB with



How to allow connection trough conatiners and EC and RDS  instaces we have created for this project

 > the Application multi-docker has been created in a specific region of thw world (MultiDocker-env.eba-fkjnhwww.us-east-2.elasticbeanstalk.com )


 VPC = Virtual Private Cloud - please to remember there is one 'default' VPC per region.
 
 We can get our different services to connect to each other by creating something called a security group. 
 A security group is a really fancy term for a Firewall rule, it's a rule discribing
 what different sources of Internet traffic can connect to different services running inside of your VPC.

 In order to connect our EB new application with RDS (Postgres) and EC (Redis) we need to create a new 
 security group.

 The security group is going to say essentially as a rule lat any traffic access this instance 
 if it belongs to the security group.

 So we are going to create a security group and then we are going to attach it to it all three of these different services 
 [multi-docker, postgres and redis]




