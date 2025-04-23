"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchOrders } from "@/lib/api"

export function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    getOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500 hover:bg-green-600"
      case "processing":
        return "bg-blue-500 hover:bg-blue-600"
      case "shipped":
        return "bg-purple-500 hover:bg-purple-600"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="space-y-2">
                  <div className="h-4 w-1/4 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and track your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                <Button className="mt-4" asChild>
                  <a href="/products">Start Shopping</a>
                </Button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Total:</span> ${order.total.toFixed(2)} • {order.items} items
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {order.status === "Delivered" && (
                        <Button variant="outline" size="sm">
                          Buy Again
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {orders
              .filter((order) => order.status.toLowerCase() === "processing")
              .map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <Badge className="bg-blue-500 hover:bg-blue-600">{order.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Total:</span> ${order.total.toFixed(2)} • {order.items} items
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
          </TabsContent>

          {/* Similar TabsContent for "shipped" and "delivered" statuses */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
