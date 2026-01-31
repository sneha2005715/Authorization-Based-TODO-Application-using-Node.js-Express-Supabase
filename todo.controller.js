import supabase from "../config/supabase.js";

export const createTodo = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.userId;

  if (!title) return res.status(400).json({ message: "Title required" });

  const { data, error } = await supabase.from("todos").insert([
    { title, userId },
  ]).select();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json(data[0]);
};

export const getTodos = async (req, res) => {
  const userId = req.user.userId;

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("userId", userId)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json(data);
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title, completed } = req.body;

  const { data: todo } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (!todo) return res.status(404).json({ message: "Todo not found" });
  if (todo.userId !== userId)
    return res.status(403).json({ message: "Unauthorized" });

  const { data, error } = await supabase
    .from("todos")
    .update({ title, completed })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json(data[0]);
};

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const { data: todo } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (!todo) return res.status(404).json({ message: "Todo not found" });
  if (todo.userId !== userId)
    return res.status(403).json({ message: "Unauthorized" });

  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) return res.status(500).json({ message: error.message });

  res.status(200).json({ message: "Todo deleted successfully" });
};
