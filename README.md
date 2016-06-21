# childcaredeserts
**Collaborators:** Raheed Malik  
**Team:** Early Childhood  
**Goal:** Visualize zipcodes with low access to quality child care and how it correlates the the area's race and income   
**Audience:**  

A dataset of child care centers for GA, NC, MN, IL, VA, MD, OH, CO, and WA with quality (QRIS) ratings. Each state has a different rating, so we normalize to 3 tiers (top, middle, and bottom) with a 4th category that simply qualifies the center as "licensed." These centers will be overlayed on top of a base layer of zipcode boundaries, shaded by zipcode demographic characteristics.

For the base layer, we’ve decided on four metrics, using a toggle or dropdown:
 - Population density- using the 2010 Census file in the dropbox + a dataset that has square miles for each ZCTA in 2010 Census.
 - Mean Reported Earnings- using the IRS data, dividing the amount of salaries and wages in AGI (Excel: column J) by the number of tax returns (Excel: column I) in each ZCTA.
 - Percent African American- using the 2010 Census ZCTAs
 - Percent Hispanic/Latino- using the 2010 Census ZCTAs

 User should be able to toggle between zipcode characteristics and hover over a center to see more details.

 
