Create a shadcn data table. Use a useQuery hook from react-query to populate the table data. All table data is managed by the useQuery hook. The hook calls an action with a prisma query. Changing the searching, sorting, or pagination with the data table UI will update the query.

Searching:
A search bar at the top left to filter any long string columns such as name and description. The filter query is applied in a debounced function imported from a debounce package

Sorting:
Clicking on a column header will toggle between sorting the column in ascending order, then descending order, then no sorting (table default). A chevron icon is on the right side of each column header, pointing up when ascending, down when descending and opactiy-0 (not hidden) when no sorting is applied

Pagination:
All table rows are a fixed height, defined by a constant at the top of the component. The number of items per page is dynamically determined by the available vertical space in the data table divided by the row height, rounded down to the nearest integer.
Include the pagination at the bottom right of the table. This should minify down on small screens.

Fetching state:
When the useQuery hook is fetching, the stale content should still render in the table. During fetching the text content in the table cells should have 0 opacity and each of the cells in the table should render absolute positioned div elements with "inset-3 rounded bg-gray-200 animate-pulse".
