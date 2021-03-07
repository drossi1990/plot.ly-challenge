///-------Belly Button Biodiversity JS/Plotly App---------///
function retrieve_metadata(sample) {
    //retrieve metadata from json, filter results by sample #, and clear existing metadata
    d3.json("samples.json").then((data) => {
      var metadata= data.metadata;
      var samplesarray= metadata.filter(sampleobject => sampleobject.id == sample);
      var samp_return = samplesarray[0]
        //   console.log(samp_return)
        //reference to data display panel
        var sample_panel = d3.select("#sample-metadata");
        //clears panel of existing data
        sample_panel.html("");
        //loop to add key and value pair to panel for current selection
      Object.entries(samp_return).forEach(([key, value]) => {
        sample_panel.append("h4").text(`${key.toUpperCase()}: ${value}`);
      });

    });
  }
  
  function chart_constructor(sample) {
    //assigning variables to build charts
    d3.json("samples.json").then((data) => {
      var bb_samples = data.samples;
      var bb_results = bb_samples.filter(sampleObj => sampleObj.id == sample);
      var culture_result = bb_results[0];
      var culture_ids = culture_result.otu_ids;
      var culture_labels = culture_result.otu_labels;
      var sample_values = culture_result.sample_values;
      var yticks = culture_ids.slice(0, 20).map(otuID => `OTU ${otuID}`).reverse();
     //Assigning data for barchart to display Top 20 strains
      var bar_data = [
        {
          x: sample_values.slice(0, 20).reverse(),
          y:yticks,
          text: culture_labels.slice(0, 20).reverse(),
          type: "bar",
          marker:{
          color: 'green'},
          orientation: "h",
        }
      ];
      //Assigning layout for barchart
      var bar_layout = {
       title: "Top 20 Most Prevalent Cultures in Sample",
       yaxis: {
        tickangle: 15
      },
        margin: { t: 50, l: 60 }
      };
      
      //plotting barchart
      Plotly.newPlot("bar", bar_data, bar_layout);

      //assigning bubble data
      var bubble_data = [
        {
          x: culture_ids,
          y: sample_values,
          text: culture_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: culture_ids,
            colorscale: "Jet"
          }
        }
      ];
      //assigning layout of bubble chart

      var bubble_layout = {
        title: "Bacterial Cultures Detected in Sample",
        hovermode: "x",
        xaxis: { title: "OTU ID" },
        margin: { t: 50, l: 60 }
      };
     
      //plotting bubble chart
      Plotly.newPlot("bubble", bubble_data, bubble_layout);

    });
    
  }


  //Initialization function to construct initial dashboard
  function Initialize() {
  console.log("Initialized")
    //grabs a reference to the dropdown menu from the index
    var dropdown = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sample_list = data.names;
  
      sample_list.forEach((sample) => {
        dropdown
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // takes the initial sample for the list to display chart data before user makes additional input 
      var init_sample = sample_list[0];
      chart_constructor(init_sample);
      retrieve_metadata(init_sample);
    });
  }

// updates dashboard with user selection of a new data sample
function select_new(user_selection) {
    chart_constructor(user_selection);
    retrieve_metadata(user_selection);
}


//launch page
Initialize();
  