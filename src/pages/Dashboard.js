import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {Container,Typography,Paper,Table,TableHead,TableBody,TableRow,TableCell,TablePagination,Select,MenuItem,FormControl,
InputLabel,Tabs,Tab,Box,TextField,} from "@mui/material";
import { useTable } from "react-table";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [inventoryData, setInventoryData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [inventoryFilter, setInventoryFilter] = useState("All");
  const [inventorySearch, setInventorySearch] = useState("");
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersRowsPerPage, setOrdersRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("/mockInventory.json")
      .then((response) => {
        console.log("Inventory Data:", response.data);
        setInventoryData(response.data);
      })
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);

  // Fetch orders data
  useEffect(() => {
    axios
      .get("/mockOrders.json")
      .then((response) => {
        console.log("Orders Data:", response.data);
        setOrdersData(response.data);
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredInventoryData = inventoryData.filter((item) => {
    const matchesFilter =
      inventoryFilter === "All" || item.status === inventoryFilter;
    const matchesSearch = item.item
      .toLowerCase()
      .includes(inventorySearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const ordersColumns = useMemo(
    () => [
      { Header: "Order ID", accessor: "id" },
      { Header: "Customer Name", accessor: "customerName" },
      { Header: "Product", accessor: "product" },
      { Header: "Quantity", accessor: "quantity" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <FormControl variant="outlined" fullWidth>
            <Select
              value={row.original.status}
              onChange={(e) =>
                handleOrderStatusChange(row.original.id, e.target.value)
              }
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
            </Select>
          </FormControl>
        ),
      },
      { Header: "Order Date", accessor: "orderDate" },
    ],
    []
  );

  // React Table instance for orders
  const {
    getTableProps: getOrdersTableProps,
    getTableBodyProps: getOrdersTableBodyProps,
    headerGroups: ordersHeaderGroups,
    rows: ordersRows,
    prepareRow: prepareOrdersRow,
  } = useTable({ columns: ordersColumns, data: ordersData });

  // Pagination handlers for orders
  const handleOrdersPageChange = (event, newPage) => {
    setOrdersPage(newPage);
  };

  const handleOrdersRowsPerPageChange = (event) => {
    setOrdersRowsPerPage(parseInt(event.target.value, 10));
    setOrdersPage(0);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Smart Automation Dashboard
        </Typography>

        {/* Tabs for Inventory and Orders */}
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Inventory & Production" />
          <Tab label="Order Management" />
        </Tabs>

        {/* Inventory & Production Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
              Inventory & Production Planning
            </Typography>

            {/* Search Bar */}
            <TextField
              label="Search items..."
              variant="outlined"
              fullWidth
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              style={{ marginBottom: "20px" }}
            />

            {/* Filter Dropdown */}
            <FormControl
              variant="outlined"
              fullWidth
              style={{ marginBottom: "20px" }}
            >
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={inventoryFilter}
                onChange={(e) => setInventoryFilter(e.target.value)}
                label="Filter by Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Delayed">Delayed</MenuItem>
              </Select>
            </FormControl>

            {/* Inventory Table */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Category</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Stock</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Deadline</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventoryData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.stock} {item.unit}
                    </TableCell>
                    <TableCell>{item.status || "N/A"}</TableCell>
                    <TableCell>{item.deadline || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}

        {/* Order Management Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom style={{ marginTop: "20px" }}>
              Order Management System
            </Typography>

            {/* Orders Table */}
            <Table {...getOrdersTableProps()}>
              <TableHead>
                {ordersHeaderGroups.map((headerGroup) => (
                  <TableRow {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <TableCell {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody {...getOrdersTableBodyProps()}>
                {ordersRows
                  .slice(
                    ordersPage * ordersRowsPerPage,
                    ordersPage * ordersRowsPerPage + ordersRowsPerPage
                  )
                  .map((row) => {
                    prepareOrdersRow(row);
                    return (
                      <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <TableCell {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={ordersData.length}
              rowsPerPage={ordersRowsPerPage}
              page={ordersPage}
              onPageChange={handleOrdersPageChange}
              onRowsPerPageChange={handleOrdersRowsPerPageChange}
            />
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
