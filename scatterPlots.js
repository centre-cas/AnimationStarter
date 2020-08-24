
//get mean of the grades in the array entries
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}


var updateScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{
	console.log("updating graph");
	
//labels graph with xProp on X axis and yProp on Y axis	
	setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
	
//creates a circle for each student with x value taken from xProp and y value 
	//from yProp 
	
    var c = d3.select(target)
		.select(".graph")
    	.selectAll("circle")
    	.data(students);
	
	//ENTER  add new stuff
    	c.enter()
    		.append("circle");
	
	//EXIT  remove old stuff
		c.exit()
		.remove();
	
	//UPDATE  REDECORATE
	
	d3.select(".graph")
		.selectAll("circle")
		.transition()
		.duration(1000)
	
    	.attr("cx",function(student)
    	{
        	return xScale(getMeanGrade(student[xProp]));    
    	})
		.attr("cy",function(student)
    	{
        	return yScale(getMeanGrade(student[yProp]));    
    	})
    	.attr("r",4);
	
		
	}


//removes all the circles from a previous graph drawing
var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
}

// draw the axes
var createAxes = function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}

//prepares graph for drawing

var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up
    var graph = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    
    createAxes(screen,margins,graph,target,xScale,yScale);
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to graphs");
    
    

}



//sets up call back functions for the mouse click

var initButtons = function(students,target,xScale,yScale)
{
    
    d3.select("#fvh")
    .on("click",function()
    {
        
        updateScatter(students,target,
              xScale,yScale,"final","homework");
    })
    
    d3.select("#hvq")
    .on("click",function()
    {
        
        updateScatter(students,target,
              xScale,yScale,"homework","test");
    })
    
    d3.select("#tvf")
    .on("click",function()
    {
        //clearScatter(target);
        updateScatter(students,target,
              xScale,yScale,"test","final");
    })
    
    d3.select("#tvq")
    .on("click",function()
    {
        //clearScatter(target);
        updateScatter(students,target,
              xScale,yScale,"test","quizes");
    })
    
    
    
}

var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}



// read in the data

var penguinPromise = d3.json("classData.json");

//what happens on success or failure

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});
