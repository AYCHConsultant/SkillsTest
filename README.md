# Skill-test
Hosted on heroku at https://skills-test.herokuapp.com/

## Built with
 * [Django](https://www.djangoproject.com/) - Web framework used


 ## API Usage
 
 Make a POST request with skill name in body to https://skills-test.herokuapp.com/api/skill to add a new skill.
 <br>Example : POST with body {"name" : "Django"}
 <br><br>
 Make a GET request with id to https://skills-test.herokuapp.com/api/skill/id to get skill of that particular id.<br> 
 Example output : {"name" : "Java", "approved":"true"} approved tells whether the skill is approved else it is rejected.
 <br><br>
 Make a PATCH request with id and changed values to https://skills-test.herokuapp.com/api/skill/id to update skill data with that particular id.<br>
 Example : Patch request with body {"approved":"false"} this changes the approved to false of the skill with given id.
 <br><br>
 Make a DELETE request with id  to https://skills-test.herokuapp.com/api/skill/id to delete a skill with that particular id.<br> 
